import { createClient } from '@supabase/supabase-js';



const supabaseUrl = 'https://vcnjvtjzrgrngfhckrko.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjbmp2dGp6cmdybmdmaGNrcmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4MDE0NzIsImV4cCI6MjAzMzM3NzQ3Mn0.RP2goG1CHU6Uf0zGCANRFm2ty52OG7GVLFK-qHcbaSM'



export const supabase = createClient(supabaseUrl, supabaseKey);