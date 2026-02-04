from djongo import models
from bson import ObjectId


class User(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=200)
    alias = models.CharField(max_length=200, blank=True, null=True)
    team = models.CharField(max_length=100, blank=True, null=True)
    total_points = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'
        managed = False

    def __str__(self):
        return self.name


class Team(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    captain_id = models.CharField(max_length=100)  # ObjectId as string
    member_ids = models.JSONField(default=list)  # List of ObjectIds
    total_points = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'teams'
        managed = False

    def __str__(self):
        return self.name


class Activity(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    user_id = models.CharField(max_length=100)  # ObjectId as string
    type = models.CharField(max_length=100)
    duration = models.IntegerField()  # minutes
    distance = models.FloatField(blank=True, null=True)  # km or miles
    calories_burned = models.IntegerField(default=0)
    points = models.IntegerField(default=0)
    date = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'activities'
        managed = False

    def __str__(self):
        return f"{self.type} - {self.duration} min"


class Leaderboard(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    type = models.CharField(max_length=50)  # 'individual' or 'team'
    entity_id = models.CharField(max_length=100)  # ObjectId as string
    name = models.CharField(max_length=200)
    points = models.IntegerField(default=0)
    rank = models.IntegerField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'leaderboard'
        managed = False

    def __str__(self):
        return f"{self.type} - {self.name} (Rank {self.rank})"


class Workout(models.Model):
    _id = models.ObjectIdField(primary_key=True, default=ObjectId)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=100)
    duration = models.IntegerField()  # minutes
    difficulty = models.CharField(max_length=50)
    exercises = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'workouts'
        managed = False

    def __str__(self):
        return self.name
