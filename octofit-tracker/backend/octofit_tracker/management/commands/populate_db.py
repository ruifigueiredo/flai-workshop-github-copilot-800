from django.core.management.base import BaseCommand
from pymongo import MongoClient
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Connect to MongoDB
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        self.stdout.write(self.style.SUCCESS('Connected to MongoDB'))

        # Clear existing data
        self.stdout.write('Clearing existing data...')
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})

        # Create unique index on email
        db.users.create_index([('email', 1)], unique=True)
        self.stdout.write(self.style.SUCCESS('Created unique index on email field'))

        # Marvel superheroes data
        marvel_heroes = [
            {'name': 'Iron Man', 'email': 'tony.stark@marvel.com', 'alias': 'Tony Stark'},
            {'name': 'Captain America', 'email': 'steve.rogers@marvel.com', 'alias': 'Steve Rogers'},
            {'name': 'Thor', 'email': 'thor.odinson@marvel.com', 'alias': 'Thor Odinson'},
            {'name': 'Hulk', 'email': 'bruce.banner@marvel.com', 'alias': 'Bruce Banner'},
            {'name': 'Black Widow', 'email': 'natasha.romanoff@marvel.com', 'alias': 'Natasha Romanoff'},
            {'name': 'Hawkeye', 'email': 'clint.barton@marvel.com', 'alias': 'Clint Barton'},
            {'name': 'Spider-Man', 'email': 'peter.parker@marvel.com', 'alias': 'Peter Parker'},
            {'name': 'Black Panther', 'email': 'tchalla@marvel.com', 'alias': 'T\'Challa'},
        ]

        # DC superheroes data
        dc_heroes = [
            {'name': 'Superman', 'email': 'clark.kent@dc.com', 'alias': 'Clark Kent'},
            {'name': 'Batman', 'email': 'bruce.wayne@dc.com', 'alias': 'Bruce Wayne'},
            {'name': 'Wonder Woman', 'email': 'diana.prince@dc.com', 'alias': 'Diana Prince'},
            {'name': 'Flash', 'email': 'barry.allen@dc.com', 'alias': 'Barry Allen'},
            {'name': 'Aquaman', 'email': 'arthur.curry@dc.com', 'alias': 'Arthur Curry'},
            {'name': 'Green Lantern', 'email': 'hal.jordan@dc.com', 'alias': 'Hal Jordan'},
            {'name': 'Cyborg', 'email': 'victor.stone@dc.com', 'alias': 'Victor Stone'},
            {'name': 'Martian Manhunter', 'email': 'john.jonzz@dc.com', 'alias': 'J\'onn J\'onzz'},
        ]

        # Insert users
        self.stdout.write('Creating users...')
        marvel_user_ids = []
        for hero in marvel_heroes:
            user_data = {
                'username': hero['name'].lower().replace(' ', '_'),
                'email': hero['email'],
                'name': hero['name'],
                'alias': hero['alias'],
                'team': 'Team Marvel',
                'total_points': random.randint(500, 2000),
                'created_at': datetime.now() - timedelta(days=random.randint(30, 180)),
            }
            result = db.users.insert_one(user_data)
            marvel_user_ids.append(result.inserted_id)

        dc_user_ids = []
        for hero in dc_heroes:
            user_data = {
                'username': hero['name'].lower().replace(' ', '_'),
                'email': hero['email'],
                'name': hero['name'],
                'alias': hero['alias'],
                'team': 'Team DC',
                'total_points': random.randint(500, 2000),
                'created_at': datetime.now() - timedelta(days=random.randint(30, 180)),
            }
            result = db.users.insert_one(user_data)
            dc_user_ids.append(result.inserted_id)

        self.stdout.write(self.style.SUCCESS(f'Created {len(marvel_user_ids) + len(dc_user_ids)} users'))

        # Insert teams
        self.stdout.write('Creating teams...')
        team_marvel = {
            'name': 'Team Marvel',
            'description': 'Earth\'s Mightiest Heroes',
            'captain_id': marvel_user_ids[0],
            'member_ids': marvel_user_ids,
            'total_points': sum([db.users.find_one({'_id': uid})['total_points'] for uid in marvel_user_ids]),
            'created_at': datetime.now() - timedelta(days=180),
        }
        team_marvel_result = db.teams.insert_one(team_marvel)

        team_dc = {
            'name': 'Team DC',
            'description': 'Justice League United',
            'captain_id': dc_user_ids[0],
            'member_ids': dc_user_ids,
            'total_points': sum([db.users.find_one({'_id': uid})['total_points'] for uid in dc_user_ids]),
            'created_at': datetime.now() - timedelta(days=180),
        }
        team_dc_result = db.teams.insert_one(team_dc)

        self.stdout.write(self.style.SUCCESS('Created 2 teams'))

        # Insert activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga', 'Boxing', 'CrossFit']
        all_user_ids = marvel_user_ids + dc_user_ids
        
        activities_count = 0
        for user_id in all_user_ids:
            # Create 5-15 random activities for each user
            num_activities = random.randint(5, 15)
            for _ in range(num_activities):
                activity_data = {
                    'user_id': user_id,
                    'type': random.choice(activity_types),
                    'duration': random.randint(15, 120),  # minutes
                    'distance': round(random.uniform(1, 15), 2) if random.choice([True, False]) else None,
                    'calories_burned': random.randint(50, 800),
                    'points': random.randint(10, 100),
                    'date': datetime.now() - timedelta(days=random.randint(0, 90)),
                    'notes': 'Great workout session!',
                }
                db.activities.insert_one(activity_data)
                activities_count += 1

        self.stdout.write(self.style.SUCCESS(f'Created {activities_count} activities'))

        # Create leaderboard entries
        self.stdout.write('Creating leaderboard entries...')
        leaderboard_entries = []
        
        # Individual leaderboard
        all_users = list(db.users.find({}))
        all_users.sort(key=lambda x: x['total_points'], reverse=True)
        for rank, user in enumerate(all_users, 1):
            leaderboard_entries.append({
                'type': 'individual',
                'entity_id': user['_id'],
                'name': user['name'],
                'points': user['total_points'],
                'rank': rank,
                'updated_at': datetime.now(),
            })

        # Team leaderboard
        teams = [
            {'id': team_marvel_result.inserted_id, 'name': 'Team Marvel', 'points': team_marvel['total_points']},
            {'id': team_dc_result.inserted_id, 'name': 'Team DC', 'points': team_dc['total_points']},
        ]
        teams.sort(key=lambda x: x['points'], reverse=True)
        for rank, team in enumerate(teams, 1):
            leaderboard_entries.append({
                'type': 'team',
                'entity_id': team['id'],
                'name': team['name'],
                'points': team['points'],
                'rank': rank,
                'updated_at': datetime.now(),
            })

        db.leaderboard.insert_many(leaderboard_entries)
        self.stdout.write(self.style.SUCCESS(f'Created {len(leaderboard_entries)} leaderboard entries'))

        # Create workout suggestions
        self.stdout.write('Creating workout suggestions...')
        workouts = [
            {
                'name': 'Morning Power Workout',
                'description': 'High-intensity interval training to kickstart your day',
                'type': 'HIIT',
                'duration': 30,
                'difficulty': 'Intermediate',
                'exercises': [
                    {'name': 'Burpees', 'sets': 3, 'reps': 15},
                    {'name': 'Push-ups', 'sets': 3, 'reps': 20},
                    {'name': 'Mountain Climbers', 'sets': 3, 'reps': 30},
                ],
                'created_at': datetime.now(),
            },
            {
                'name': 'Superhero Strength Training',
                'description': 'Build strength like a superhero',
                'type': 'Strength',
                'duration': 45,
                'difficulty': 'Advanced',
                'exercises': [
                    {'name': 'Deadlifts', 'sets': 4, 'reps': 8},
                    {'name': 'Bench Press', 'sets': 4, 'reps': 10},
                    {'name': 'Squats', 'sets': 4, 'reps': 12},
                ],
                'created_at': datetime.now(),
            },
            {
                'name': 'Cardio Blast',
                'description': 'Improve endurance and burn calories',
                'type': 'Cardio',
                'duration': 40,
                'difficulty': 'Beginner',
                'exercises': [
                    {'name': 'Running', 'duration': 20},
                    {'name': 'Jump Rope', 'duration': 10},
                    {'name': 'Jumping Jacks', 'sets': 3, 'reps': 50},
                ],
                'created_at': datetime.now(),
            },
            {
                'name': 'Flexibility & Recovery',
                'description': 'Yoga-inspired stretching routine',
                'type': 'Yoga',
                'duration': 25,
                'difficulty': 'Beginner',
                'exercises': [
                    {'name': 'Sun Salutations', 'sets': 3},
                    {'name': 'Warrior Pose', 'duration': 2},
                    {'name': 'Child Pose', 'duration': 3},
                ],
                'created_at': datetime.now(),
            },
            {
                'name': 'Hero Endurance Challenge',
                'description': 'Test your limits with this endurance workout',
                'type': 'CrossFit',
                'duration': 60,
                'difficulty': 'Advanced',
                'exercises': [
                    {'name': 'Box Jumps', 'sets': 5, 'reps': 15},
                    {'name': 'Kettlebell Swings', 'sets': 5, 'reps': 20},
                    {'name': 'Pull-ups', 'sets': 5, 'reps': 10},
                ],
                'created_at': datetime.now(),
            },
        ]
        db.workouts.insert_many(workouts)
        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts)} workout suggestions'))

        # Summary
        self.stdout.write(self.style.SUCCESS('\n' + '='*50))
        self.stdout.write(self.style.SUCCESS('Database population completed!'))
        self.stdout.write(self.style.SUCCESS('='*50))
        self.stdout.write(f'Users: {db.users.count_documents({})}')
        self.stdout.write(f'Teams: {db.teams.count_documents({})}')
        self.stdout.write(f'Activities: {db.activities.count_documents({})}')
        self.stdout.write(f'Leaderboard entries: {db.leaderboard.count_documents({})}')
        self.stdout.write(f'Workouts: {db.workouts.count_documents({})}')

        client.close()
