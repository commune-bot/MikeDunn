# KSA Basketball Training Platform

A personalized basketball training platform that generates custom training programs based on player skill level and specific shooting issues.

## Overview

The KSA (Keep Shooting Academy) Basketball Training Platform is a web application that creates personalized 14-day training programs for basketball players looking to improve their shooting form. The platform analyzes player-described shooting issues, identifies underlying mechanical problems, and generates a structured training plan with appropriate drills and video demonstrations.

## Key Features

- **Personalized Training Plans**: Generate custom 14-day training programs based on player-specific shooting issues
- **Skill Level Categorization**: Filter drills and videos based on player skill level (Beginner, Intermediate, Pro)
- **Shooting Issue Analysis**: Identify specific shooting flaws from player descriptions
- **Video Integration**: Include relevant drill videos and explanations from a comprehensive database
- **PDF Generation**: Create downloadable training plans with clickable video links
- **Responsive Design**: Mobile-friendly interface for access on any device

## Technical Architecture

### Core Components

1. **Shooting Analysis Engine**
   - Analyzes player descriptions to identify shooting issues
   - Maps issues to appropriate drills and recommendations
   - Located in `lib/shooting-analysis.ts`

2. **Drill Recommendation System**
   - Matches identified issues with appropriate drills
   - Filters recommendations based on skill level
   - Located in `lib/drill-recommendation.ts`

3. **Video Database**
   - Comprehensive collection of drill and explanation videos
   - Categorized by skill level and purpose
   - Located in `lib/video-database.ts`

4. **Skill Level Categorization**
   - Automatically categorizes drills by difficulty
   - Ensures appropriate progression for different skill levels
   - Located in `lib/skill-level-categorization.ts`

5. **PDF Generator**
   - Creates downloadable training plans
   - Includes clickable video links and detailed instructions
   - Located in `components/pdf-generator.tsx`

### Data Flow

1. User inputs shooting issues and selects skill level
2. System analyzes the description to identify specific mechanical problems
3. Recommendation engine selects appropriate drills based on issues and skill level
4. Training plan generator creates a structured 14-day program
5. User can view the plan online or download as a PDF

## Skill Level System

The platform categorizes all drills and videos into three skill levels:

- **Beginner**: Fundamental drills focusing on basic mechanics and form
- **Intermediate**: More complex drills that build on fundamentals and introduce game-like elements
- **Pro/Advanced**: Advanced drills that challenge players with game speed, pressure, and complex movements

The categorization is handled automatically based on drill names, descriptions, and complexity, ensuring that players receive appropriate challenges for their skill level.

## Video Database

The platform includes two types of videos:

1. **Drill Videos**: Demonstrations of specific basketball shooting drills
2. **Explanation Videos**: Detailed breakdowns of proper technique and mechanics

All videos are categorized by skill level and linked to specific shooting issues they address. The system ensures that every video is properly categorized, even if manually added without a specified skill level.

## Usage Guide

### Creating a Training Plan

1. Navigate to the home page
2. Enter your name and select your skill level
3. Describe your shooting issues in detail
4. Click "GET MY CUSTOM TRAINING PLAN"
5. Review your personalized training program
6. Download the PDF for offline use

### Using the Shooting Analysis Tool

1. Navigate to the Shooting Analysis page
2. Enter your name and select your skill level
3. Provide a detailed description of your shooting issues
4. Submit the form to generate a comprehensive analysis
5. Review the identified issues and recommendations
6. Access your personalized training plan

## Development

### Key Files

- `lib/shooting-analysis.ts`: Core analysis engine for identifying shooting issues
- `lib/drill-recommendation.ts`: System for matching issues with appropriate drills
- `lib/video-database.ts`: Database of all drill and explanation videos
- `lib/skill-level-categorization.ts`: Logic for categorizing drills by difficulty
- `app/actions.ts`: Server actions for generating training plans
- `components/shooting-analysis-form.tsx`: UI for the shooting analysis tool
- `components/pdf-generator.tsx`: PDF generation functionality
- `app/page.tsx`: Main landing page with skill level selection
- `app/course-viewer/page.tsx`: Training plan viewer

### Verification Tools

The project includes verification scripts to ensure all videos are properly categorized:

- `scripts/verify-all-videos-categorized.ts`: Checks that all videos have skill levels assigned
- `scripts/categorize-videos.ts`: Tool to test the automatic categorization system

## Customization

### Adding New Videos

When adding new videos to the database in `lib/video-database.ts`, you can:

1. Specify the skill level directly: `skillLevel: "beginner" | "intermediate" | "pro"`
2. Let the system automatically categorize it based on title and description

### Modifying Categorization Logic

To adjust how videos are categorized:

1. Update the pattern arrays in `lib/skill-level-categorization.ts`
2. Modify the `categorizeDrillByTitle` function for custom categorization logic
3. Use the `setVideoSkillLevel` function to manually override categorizations

### Customizing Training Plans

To modify how training plans are generated:

1. Update the `createTrainingPlan` function in `lib/drill-recommendation.ts`
2. Modify the day structure and progression in `app/actions.ts`
3. Adjust the PDF template in `components/pdf-generator.tsx`

## Future Enhancements

- Video upload functionality for player form analysis
- Progress tracking and improvement metrics
- Integration with mobile apps for on-court access
- AI-powered real-time form analysis
- Community features for sharing progress and tips

## License

This project is proprietary and confidential. All rights reserved.

© Keep Shooting Academy

