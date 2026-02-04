from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'team', 'total_points', 'created_at']
    list_filter = ['team', 'created_at']
    search_fields = ['name', 'email', 'username']
    ordering = ['-total_points']
    readonly_fields = ['_id', 'created_at']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'total_points', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['-total_points']
    readonly_fields = ['_id', 'created_at']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['type', 'user_id', 'duration', 'calories_burned', 'points', 'date']
    list_filter = ['type', 'date']
    search_fields = ['user_id', 'type', 'notes']
    ordering = ['-date']
    readonly_fields = ['_id']


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'rank', 'points', 'updated_at']
    list_filter = ['type']
    search_fields = ['name']
    ordering = ['rank']
    readonly_fields = ['_id', 'updated_at']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'duration', 'difficulty', 'created_at']
    list_filter = ['type', 'difficulty']
    search_fields = ['name', 'description']
    ordering = ['-created_at']
    readonly_fields = ['_id', 'created_at']
