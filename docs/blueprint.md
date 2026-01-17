# **App Name**: CertiFire

## Core Features:

- Authentication: Allows users to sign in for secure access.
- CSV Data Upload and Parsing: Enables users to upload .csv or .txt files containing candidate data, parsed using papaparse. If data format is invalid proceed to next step with empty data
- Data Preview Table: Displays parsed CSV data in a tabular format for review and validation.
- Template Management: Allows users to upload and delete certificate templates stored in Firebase Storage.
- Certificate Mapping Interface: Provides an interface to map CSV columns to specific regions on the certificate template using a canvas, allowing users to draw bounding boxes, which are stored along with the column names.
- Certificate Preview and Generation: Generates certificate previews by overlaying data onto the selected template according to the defined mappings, offering a carousel or list view of the output certificates.
- Download and Email Dispatch: Allows users to download generated certificates as a ZIP file using JSZip, and triggers a function to console.log an email dispatch event (simulating email sending for this MVP).

## Style Guidelines:

- Primary color: Deep Blue (#3F51B5) to evoke trust and professionalism.
- Background color: Light Blue Gray (#E8EAF6), a muted variation of the primary color.
- Accent color: Purple (#7E57C2), for interactive elements and highlights.
- Body and headline font: 'PT Sans' for a modern, yet friendly aesthetic.
- lucide-react icons should be used throughout the interface with consistent styling (size and color).
- Utilize a clean, centered layout with sufficient whitespace to emphasize content and maintain a cozy feel.
- Subtle animations, like fade-in effects or smooth transitions, should enhance user experience without being distracting.