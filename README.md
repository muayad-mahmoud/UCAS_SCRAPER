# UCAS Scraper

## How to Use

Follow the steps below to set up and run the UCAS Scraper project:

### 1. Import the Schema
Import the schema from the provided schema file into your Supabase schema. The schema file contains all necessary definitions, including functions and triggers.

### 2. Set Up a Python Virtual Environment
- Create a virtual environment:  
    ```bash
    python3 -m venv venv
    ```
- Activate the virtual environment:  
    ```bash
    source venv/bin/activate
    ```
    *(For Linux users)*

### 3. Install Dependencies
- Install the required dependencies:  
    ```bash
    pip3 install -r requirements.txt
    ```

### 4. Run the Scraping Module
- Execute the scraping module:  
    ```bash
    python3 -m scraping.main
    ```

### 5. Start the Backend Server
- Start the backend server:  
    ```bash
    uvicorn backend.course_gallery.server:app --reload --host 0.0.0.0 --port 8000
    ```

### 6. Configure Environment Variables
- Refer to the `.env.example` file and populate it with your instance-specific information before running the project.

---

Enjoy using the UCAS Scraper!

# Target Usage
This scrapes courses and options from universities on UCAS , and then saves them into database where you can use the backend and frontend to view these courses