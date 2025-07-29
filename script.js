/* Custom scrollbar for dark theme */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #2d3748; /* Darker background for the track */
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: #4a5568; /* Slightly lighter thumb */
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #6b7280; /* Even lighter on hover */
}

html, body {
    height: 100%; /* Ensure html and body take full viewport height */
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #1a202c; /* Dark background */
    color: #e2e8f0; /* Light text color */
    display: flex; /* Ensure body is a flex container */
    flex-direction: row; /* Layout sidebar and main content side-by-side */
}

/* Active link styling for sidebar */
.nav-link.active {
    background-color: #2d3748; /* Darker background for active link */
    color: #6366f1; /* Purple text color for active link */
    border-right: 3px solid #6366f1; /* Purple border on the right */
}

/* Ensure content pages take full height of their parent */
.content-page {
    height: 100%; /* Make content pages fill available height */
    display: flex;
    flex-direction: column;
    flex-grow: 1; /* Allow content page to grow */
}

.content-page > div {
    flex: 1; /* Make the inner content div expand to fill available space */
}
