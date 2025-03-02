# Geaux HelpED Database Schema

## Overview
This document outlines the database schema for the Geaux HelpED platform. We're using MongoDB as our database solution for flexibility and scalability.

## Collections

### Users
```json
{
  "_id": "ObjectId",
  "email": "string",
  "password": "string (hashed)",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "avatar": "string (URL)",
  "role": "string (enum: 'caregiver', 'care_recipient', 'admin')",
  "status": "string (enum: 'active', 'inactive', 'pending')",
  "createdAt": "Date",
  "updatedAt": "Date",
  "lastLogin": "Date"
}