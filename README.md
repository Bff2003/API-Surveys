# API-Surveys
> API for creating surveys and voting on them

## Main Logic
- Everyone can create a survey
- Everyone can update a survey
- Everyone can answer a survey
    - When voted, the user can only vote one time for each survey
- Everyone can see the results of a survey
- Everyone can delete a survey

## Routes
- `GET /api/surveys/`
- `POST /api/surveys/`
- `GET /api/surveys/:id/results`
- `POST /api/surveys/:id/vote` 
- `PUT /api/surveys/:id`
- `DELETE /api/surveys/:id`

## Models
```json
{
    "_id": "5f8d4b2b4b9f9b1b3c3b2b1b",
    "Title": "You like Ice Cream?",
    "Votes": [
        {
            "IP": "127.0.0.1",
            "Timestamp": "2023-11-19T23:35:45.559+00:00"
        }
    ]
}
```

## Installation
1. Install [Node.js](https://nodejs.org/en/)
2. Install [MongoDB](https://www.mongodb.com/)
3. Clone this repository
4. Run `npm install` in the `src` directory

## How to use
1. Run `npm start` in the `src` directory
2. Your server is now running on `localhost:3000`

## Features
- [ ] Only the creator of a survey can update it
- [ ] Only the creator of a survey can delete it
- [ ] The creator can create a group of surveys
