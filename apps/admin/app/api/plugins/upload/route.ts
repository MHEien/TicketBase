import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Allowed extensions
const allowedExtensions = ['.js', '.mjs'];

// Define max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // Check if the request has a valid content type
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content type must be multipart/form-data' },
        { status: 400 }
      );
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Validate that a file was provided
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the maximum limit of ${Math.floor(MAX_FILE_SIZE / (1024 * 1024))}MB` },
        { status: 400 }
      );
    }

    // Get file extension and validate it
    const fileName = file.name;
    const fileExtension = '.' + fileName.split('.').pop()?.toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed extensions: ${allowedExtensions.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate a version-friendly unique ID (removing hyphens)
    const uniqueId = uuidv4().replace(/-/g, '');
    const safeFileName = `${uniqueId}${fileExtension}`;
    
    // Create the plugins directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'plugins');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Define the path where the file will be saved
    const filePath = join(uploadDir, safeFileName);
    
    // Convert the file to an ArrayBuffer and then to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Write the file to disk
    await writeFile(filePath, buffer);
    
    // Calculate the public URL for the file
    const publicUrl = `/plugins/${safeFileName}`;
    
    // Check if we should upload to plugin server's storage
    // This would be done if a MinIO or other storage service is available
    const PLUGIN_SERVER_URL = process.env.PLUGIN_SERVER_URL;
    let remoteUrl = publicUrl;
    
    if (PLUGIN_SERVER_URL) {
      try {
        // Create a new FormData object for the plugin server
        const serverFormData = new FormData();
        serverFormData.append('file', file);
        serverFormData.append('pluginId', uniqueId);
        
        // Upload to plugin server storage
        const response = await fetch(`${PLUGIN_SERVER_URL}/plugins/bundles/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PLUGIN_SERVER_API_KEY || ''}`
          },
          body: serverFormData
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            remoteUrl = data.url; // Use the URL from the plugin server
          }
        } else {
          console.error('Failed to upload to plugin server storage:', await response.text());
          // Continue using the local URL
        }
      } catch (serverError) {
        console.error('Error connecting to plugin server for upload:', serverError);
        // Continue using the local URL
      }
    }
    
    // Return the URL to the uploaded file
    return NextResponse.json({ 
      success: true, 
      bundleUrl: remoteUrl,
      fileName: safeFileName,
      pluginId: uniqueId
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// Max file size for the route
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
}; 