from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import User, Team, Activity, Leaderboard, Workout
from .serializers import (
    UserSerializer, 
    TeamSerializer, 
    ActivitySerializer, 
    LeaderboardSerializer, 
    WorkoutSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for users
    
    List all users, create new user, retrieve, update or delete a user
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_queryset(self):
        queryset = User.objects.all()
        team = self.request.query_params.get('team', None)
        if team is not None:
            queryset = queryset.filter(team=team)
        return queryset.order_by('-total_points')


class TeamViewSet(viewsets.ModelViewSet):
    """
    API endpoint for teams
    
    List all teams, create new team, retrieve, update or delete a team
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    
    def get_queryset(self):
        return Team.objects.all().order_by('-total_points')


class ActivityViewSet(viewsets.ModelViewSet):
    """
    API endpoint for activities
    
    List all activities, create new activity, retrieve, update or delete an activity
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    
    def get_queryset(self):
        queryset = Activity.objects.all()
        user_id = self.request.query_params.get('user_id', None)
        activity_type = self.request.query_params.get('type', None)
        
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        if activity_type is not None:
            queryset = queryset.filter(type=activity_type)
        
        return queryset.order_by('-date')


class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for leaderboard (read-only)
    
    List leaderboard entries, retrieve specific entry
    """
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer
    
    def get_queryset(self):
        queryset = Leaderboard.objects.all()
        leaderboard_type = self.request.query_params.get('type', None)
        
        if leaderboard_type is not None:
            queryset = queryset.filter(type=leaderboard_type)
        
        return queryset.order_by('rank')


class WorkoutViewSet(viewsets.ModelViewSet):
    """
    API endpoint for workouts
    
    List all workouts, create new workout, retrieve, update or delete a workout
    """
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    
    def get_queryset(self):
        queryset = Workout.objects.all()
        workout_type = self.request.query_params.get('type', None)
        difficulty = self.request.query_params.get('difficulty', None)
        
        if workout_type is not None:
            queryset = queryset.filter(type=workout_type)
        if difficulty is not None:
            queryset = queryset.filter(difficulty=difficulty)
        
        return queryset.order_by('-created_at')
