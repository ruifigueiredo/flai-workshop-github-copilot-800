from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from .models import User, Team, Activity, Leaderboard, Workout
from bson import ObjectId
from datetime import datetime


class UserModelTest(TestCase):
    """Test cases for User model"""
    
    def setUp(self):
        self.user_data = {
            'username': 'test_user',
            'email': 'test@example.com',
            'name': 'Test User',
            'alias': 'The Tester',
            'team': 'Test Team',
            'total_points': 100
        }
    
    def test_user_creation(self):
        """Test creating a user"""
        user = User(**self.user_data)
        self.assertEqual(user.name, 'Test User')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.total_points, 100)


class TeamModelTest(TestCase):
    """Test cases for Team model"""
    
    def setUp(self):
        self.team_data = {
            'name': 'Test Team',
            'description': 'A test team',
            'captain_id': str(ObjectId()),
            'member_ids': [str(ObjectId()), str(ObjectId())],
            'total_points': 500
        }
    
    def test_team_creation(self):
        """Test creating a team"""
        team = Team(**self.team_data)
        self.assertEqual(team.name, 'Test Team')
        self.assertEqual(team.total_points, 500)
        self.assertEqual(len(team.member_ids), 2)


class ActivityModelTest(TestCase):
    """Test cases for Activity model"""
    
    def setUp(self):
        self.activity_data = {
            'user_id': str(ObjectId()),
            'type': 'Running',
            'duration': 30,
            'distance': 5.0,
            'calories_burned': 300,
            'points': 50,
            'date': datetime.now(),
            'notes': 'Great run!'
        }
    
    def test_activity_creation(self):
        """Test creating an activity"""
        activity = Activity(**self.activity_data)
        self.assertEqual(activity.type, 'Running')
        self.assertEqual(activity.duration, 30)
        self.assertEqual(activity.points, 50)


class UserAPITest(APITestCase):
    """Test cases for User API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user_url = reverse('user-list')
    
    def test_get_users_list(self):
        """Test retrieving list of users"""
        response = self.client.get(self.user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = self.client.get(reverse('api-root'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)


class TeamAPITest(APITestCase):
    """Test cases for Team API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.team_url = reverse('team-list')
    
    def test_get_teams_list(self):
        """Test retrieving list of teams"""
        response = self.client.get(self.team_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ActivityAPITest(APITestCase):
    """Test cases for Activity API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.activity_url = reverse('activity-list')
    
    def test_get_activities_list(self):
        """Test retrieving list of activities"""
        response = self.client.get(self.activity_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardAPITest(APITestCase):
    """Test cases for Leaderboard API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.leaderboard_url = reverse('leaderboard-list')
    
    def test_get_leaderboard_list(self):
        """Test retrieving leaderboard"""
        response = self.client.get(self.leaderboard_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_get_individual_leaderboard(self):
        """Test retrieving individual leaderboard"""
        response = self.client.get(self.leaderboard_url, {'type': 'individual'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_get_team_leaderboard(self):
        """Test retrieving team leaderboard"""
        response = self.client.get(self.leaderboard_url, {'type': 'team'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    """Test cases for Workout API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.workout_url = reverse('workout-list')
    
    def test_get_workouts_list(self):
        """Test retrieving list of workouts"""
        response = self.client.get(self.workout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
