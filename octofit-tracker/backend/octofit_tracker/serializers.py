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
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'captain_id', 'member_ids', 'member_count', 'total_points', 'created_at']
    
    def get_id(self, obj):
        return str(obj._id)
    
    def get_member_count(self, obj):
        """Return the count of members in the team"""
        if hasattr(obj, 'member_ids') and obj.member_ids:
            return len(obj.member_ids)
        return 0


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
    user_name = serializers.SerializerMethodField()
    team_name = serializers.SerializerMethodField()
    activity_count = serializers.SerializerMethodField()
    total_duration = serializers.SerializerMethodField()
    total_distance = serializers.SerializerMethodField()
    total_calories = serializers.SerializerMethodField()
    total_points = serializers.SerializerMethodField()
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'type', 'entity_id', 'name', 'user_name', 'team_name', 
                  'points', 'total_points', 'rank', 'activity_count', 'total_duration', 
                  'total_distance', 'total_calories', 'updated_at']
    
    def get_id(self, obj):
        return str(obj._id)
    
    def get_user_name(self, obj):
        """Get the user name from the entity_id"""
        if obj.type == 'individual' and obj.entity_id:
            try:
                user = User.objects.filter(_id=obj.entity_id).first()
                return user.name if user else obj.name
            except:
                return obj.name
        return obj.name
    
    def get_team_name(self, obj):
        """Get the team name for the user"""
        if obj.type == 'individual' and obj.entity_id:
            try:
                user = User.objects.filter(_id=obj.entity_id).first()
                if user and user.team:
                    team = Team.objects.filter(name=user.team).first()
                    return team.name if team else user.team
            except:
                pass
        return None
    
    def get_total_points(self, obj):
        """Return the points field as total_points"""
        return obj.points
    
    def get_activity_count(self, obj):
        """Get the count of activities for this entity"""
        if obj.type == 'individual' and obj.entity_id:
            try:
                return Activity.objects.filter(user_id=str(obj.entity_id)).count()
            except:
                pass
        return 0
    
    def get_total_duration(self, obj):
        """Get the total duration of activities for this entity"""
        if obj.type == 'individual' and obj.entity_id:
            try:
                activities = Activity.objects.filter(user_id=str(obj.entity_id))
                total = sum(activity.duration for activity in activities)
                return total
            except:
                pass
        return 0
    
    def get_total_distance(self, obj):
        """Get the total distance of activities for this entity"""
        if obj.type == 'individual' and obj.entity_id:
            try:
                activities = Activity.objects.filter(user_id=str(obj.entity_id))
                total = sum(activity.distance or 0 for activity in activities)
                return round(total, 2)
            except:
                pass
        return 0
    
    def get_total_calories(self, obj):
        """Get the total calories burned for this entity"""
        if obj.type == 'individual' and obj.entity_id:
            try:
                activities = Activity.objects.filter(user_id=str(obj.entity_id))
                total = sum(activity.calories_burned or 0 for activity in activities)
                return total
            except:
                pass
        return 0


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    exercises = serializers.JSONField()
    
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'type', 'duration', 'difficulty', 'exercises', 'created_at']
    
    def get_id(self, obj):
        return str(obj._id)
