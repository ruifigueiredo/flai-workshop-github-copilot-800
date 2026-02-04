from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout
from bson import ObjectId


class ObjectIdField(serializers.Field):
    """Custom field to serialize ObjectId to string and deserialize string to ObjectId"""
    
    def to_representation(self, value):
        if isinstance(value, ObjectId):
            return str(value)
        return str(value)
    
    def to_internal_value(self, data):
        try:
            return ObjectId(data)
        except Exception:
            raise serializers.ValidationError("Invalid ObjectId format")


class UserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'alias', 'team', 'total_points', 'created_at']
    
    def get_id(self, obj):
        return str(obj._id)


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    captain_id = serializers.CharField()
    member_ids = serializers.ListField(child=serializers.CharField())
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'captain_id', 'member_ids', 'total_points', 'created_at']
    
    def get_id(self, obj):
        return str(obj._id)


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user_id = serializers.CharField()
    
    class Meta:
        model = Activity
        fields = ['id', 'user_id', 'type', 'duration', 'distance', 'calories_burned', 'points', 'date', 'notes']
    
    def get_id(self, obj):
        return str(obj._id)


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    entity_id = serializers.CharField()
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'type', 'entity_id', 'name', 'points', 'rank', 'updated_at']
    
    def get_id(self, obj):
        return str(obj._id)


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    exercises = serializers.JSONField()
    
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'type', 'duration', 'difficulty', 'exercises', 'created_at']
    
    def get_id(self, obj):
        return str(obj._id)
