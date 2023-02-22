import { useState, useEffect} from 'react'
import './form.css'
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs'


const API = "http://localhost:5000"

const Form = () => {

    
    const [title, setTitle] = useState("")
    const [time, setTime] = useState("")
    const [loading, setLoading] = useState(false)
    const [todos, setTodos] = useState([])

    // Load todos on page load

    useEffect(() => {

        const loadData = async () => {

        setLoading(true)

            const res = await fetch(API + "/todos")
            .then((res) => res.json())
            .then((data) => data)
            .catch((err) => console.log(err));
        
        setLoading(false)

        setTodos(res)
      };

      loadData()

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const todo = {
            id: Math.random(),
            title, 
            time, 
            done:false
        }
        //envio para api
        console.log(todo)

        await fetch(API + "/todos", {
            method: "POST",
            body: JSON.stringify(todo),
            headers:{
                "content-Type": "application/json",
            }
        })

        setTodos((prevState) => [...prevState, todo]);

        setTitle("")
        setTime("")
    };

    const handleDelete = async (id) => {
         await fetch(API + "/todos/" + id, {
            method: "DELETE",
        })

        setTodos((prevState) => prevState.filter((todo) => todo.id !== id))

    }

    const handleEdit = async (todo) => {
        todo.done = !todo.done;

        const data = await fetch(API + "/todos/" + todo.id, {
            method: "PUT",
            body: JSON.stringify(todo),
            headers:{
                "content-Type": "application/json",
            }
        })

        setTodos((prevState) => prevState.map((t) => (t.id === data.id ? (t = data) : t))
        );
    };

    if(loading) {
        return (
            <p>Carregando...</p>
        )
    }
        

    return (
        <div>
            <h2>Inserir próxima tarefa:</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-controll">
                    <label htmlFor="title">O que eu preciso fazer?</label>
                    <input type="text"
                     name="title" 
                     placeholder="Título da tarefa:" 
                     onChange={(e) => setTitle(e.target.value)}
                     value={title || ""} 
                     required   
                    />
                </div>
                <div className="form-controll">
                    <label htmlFor="time">Quanto tempo vai levar?</label>
                    <input type="text"
                     name="time" 
                     placeholder="Tempo estimado em horas:" 
                     onChange={(e) => setTime(e.target.value)}
                     value={time || ""} 
                     required   
                    />
                </div>
                <input type="submit" value="Criar tarefa" className='criar-tarefa'/>
            </form>

            <div className='list-todo'>
                <h2>Lista de tarefas: </h2>
                {todos.length === 0 && <p>Ainda não há tarefas :( </p>}
                {todos.map((todo) => (
                    <div className='todo' key={todo.id}>
                        <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
                        <p>Tempo estimado: {todo.time}</p>
                        <div className='actions'>
                            <span onClick={() => handleEdit(todo)}>
                                {!todo.done ? <BsBookmarkCheck/> : <BsBookmarkCheckFill/>}
                            </span>
                            <BsTrash onClick={() => handleDelete(todo.id)}/>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Form