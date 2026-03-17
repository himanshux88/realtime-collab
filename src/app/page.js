// import { supabase } from "services/supabaseClient"

// export default async function testConnection () {
//   const {data,error}  = await supabase.from('documents').select('*');
//   console.log(data,error)
// }

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">
        Real-time Collaboration App
      </h1>
    </div>
  )
}

