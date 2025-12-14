# Part 2 API Documentation

## Academic Endpoints

### 1. Get All Courses

- **URL:** `GET /api/v1/courses`
- **Method:** `GET`
- **Auth:** Required
- **Response:**
  ```json
  {
  "success": true,
  "data": [
  { "id": 1, "code": "CSE101", "name": "Computer Engineering" }
  ]
  }
