import { useEffect, useState } from "react"


export default function Home(){
    
    const [incomes, setIncomes] = useState([]);

    
    useEffect(()=>{
        const fetchIncomes = async () => {
            try{
                const response = await fetch("/.nelify/functions/firestore");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setIncomes(data);
            } catch (error){
                console.error("error fetch incomes: ", error);
            }            
        } 
        fetchIncomes();
    }, [])

    return(
        <div className="home">
            
            <h1>Home</h1>
            
            {incomes.map(el=>(
                <div key={index}>
                    {console.log(el)} 
                    <p>{el.id}: {JSON.stringify(el)}</p>
                </div>
            ))}
            
            
            
        </div>
    )
}