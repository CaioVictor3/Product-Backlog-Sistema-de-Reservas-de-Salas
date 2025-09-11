# Room Reservation System

A simple, web-based room reservation system that allows administrators to view all bookings and students to make and manage their own reservations. The system uses mock data stored in the browser's `localStorage`, making it a fully client-side application that requires no backend setup.

## Project Overview

This project consists of several HTML pages that provide an interface for a room reservation system. It is designed to demonstrate front-end functionalities, including DOM manipulation, client-side state management, and responsive design using Bootstrap.

The system has two main user personas:
- **Admin:** Can view a dashboard with a list of all reservations made by students.
- **Student:** Can view available rooms, make new reservations, and see a list of their own bookings.

The project is built with the following technologies:
- **HTML5:** For the structure of the web pages.
- **CSS3 & Bootstrap 5:** For styling and responsive design.
- **JavaScript (ES6):** For the application logic, including data management and user interactivity.

## File Structure

The project is composed of the following HTML files:

- **`login.html`**: The entry point for all users. It authenticates users based on the mock data and redirects them to the appropriate dashboard.
- **`index.html`**: The admin dashboard, which displays a list of all reservations in the system. Access is restricted to admin users only.
- **`student-dashboard.html`**: The student dashboard. Here, students can view available rooms based on a date filter, make new reservations, and view their existing bookings.
- **`available-rooms.html`**: A standalone file that appears to be an older version or a prototype of the system. It has its own login logic and a hardcoded dataset and is not integrated with the other files.

## Features

### Authentication
- Users can log in using the provided demo credentials.
- The system distinguishes between **admin** and **student** users, redirecting them to their respective pages.

### Admin Dashboard
- **View All Reservations:** Displays a table with all bookings, including the student's name, room, date, and time.
- **Responsive Design:** The interface adapts to different screen sizes.
- **Secure Logout:** Allows the admin to end the session.

### Student Dashboard
- **View Available Rooms:** Students can select a date to see room availability.
- **Make a Reservation:** Students can book an available room by selecting a time slot and specifying the purpose.
- **View My Reservations:** A dedicated tab shows a history of all reservations made by the student.
- **Reservation Validation:** The system prevents double-booking on the same date and ensures that reservations are made in advance.

## How to Run the Project

To run this project, simply follow these steps:

1.  **Clone the repository or download the files** to your local machine.
2.  **Navigate to the project directory.**
3.  **Open the `login.html` file in your preferred web browser** (such as Chrome, Firefox, or Edge).

Since the project does not require a backend server, it can be run directly from your local file system.

## Demo Credentials

Use the following credentials to log in and test the system:

### Administrator
- **Email:** `joao@email.com`
- **Password:** `admin123`

### Students
- **Email:** `maria@email.com`
- **Password:** `student123`
- **Email:** `pedro@email.com`
- **Password:** `student123`
- **Email:** `ana@email.com`
- **Password:** `student123`
- **Email:** `carlos@email.com`
- **Password:** `student123`

## Known Limitations

- **Data Persistence:** All data is stored in the browser's `localStorage`. Clearing browser data or using incognito mode will reset the application's state.
- **No Backend:** The system does not have a backend, so data is not shared between different users or browsers.
- **Security:** The authentication is for demonstration purposes only and is not secure for production use.
- **`available-rooms.html`:** This file is not integrated into the main application flow and should be considered a development artifact.
