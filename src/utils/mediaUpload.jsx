import { createClient } from "@supabase/supabase-js"

  

    const url = "https://bupiyowktczzazbmuwuy.supabase.co"
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cGl5b3drdGN6emF6Ym11d3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTc4ODMsImV4cCI6MjA2MjI5Mzg4M30.R6xH8EC1DYVen78JSCZieP4iRKfurvEo1bliB2avKlM"

const supabase = createClient(url, key)
    
export default function mediaUpload(file) {
    const mediaUploadPromise = new Promise(
        (resolve,reject) => {
            if (file == null) {
                reject("No file Select")
                return
            }
            const timeStamp = new Date().getTime()
            const newName = timeStamp + file.name
            
            supabase.storage.from("avatar").upload(newName, file, {
                upsert: false,
                cacheControl:"3600"
            }).then(() => {
               const publicUrl = supabase.storage.from("avatar").getPublicUrl(newName).data.publicUrl
                
                resolve(publicUrl)
            }).catch((e) => {
                
                reject("Error occured supabase connection")
           })
        }
    )

    return mediaUploadPromise
}