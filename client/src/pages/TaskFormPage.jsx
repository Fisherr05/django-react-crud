import {useForm} from "react-hook-form";
import {createTask, deleteTask, getTask, updateTask} from "../api/tasks.api.js";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import {toast} from "react-hot-toast";

export function TaskFormPage() {

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue
    } = useForm();
    const navigate = useNavigate();
    const params = useParams()
    console.log(params)

    const onSubmit = handleSubmit(async data => {
        if (params.id) {
            await updateTask(params.id, data)
            toast.success('Tarea actualizada', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff"
                }
            })
        } else {
            await createTask(data);
            toast.success('Tarea creada', {
                position: "bottom-right",
                style: {
                    background: "#101010",
                    color: "#fff"
                }
            })
        }
        navigate("/tasks");
    })

    useEffect(() => {
        async function loadTask() {
            if (params.id) {
                console.log("Obteniendo datos")
                const {data: {title, description}} = await getTask(params.id)
                setValue('title', title)
                setValue('description', description)
            }
        }

        loadTask();
    }, []);

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="title" name="" id=""
                       {...register("title", {required: true})}
                />
                {errors.title &&
                    <span>Este campo es requerido</span>
                }
                <textarea rows="3" placeholder="description"
                          {...register("description", {required: true})}></textarea>
                {errors.description &&
                    <span>Este campo es requerido</span>
                }
                <button>guardar</button>
            </form>
            {params.id && (<button onClick={async () => {
                const accepted = globalThis.confirm("¿Estás seguro?")
                if (accepted) {
                    await deleteTask(params.id)
                    toast.success('Tarea eliminada', {
                        position: "bottom-right",
                        style: {
                            background: "#101010",
                            color: "#fff"
                        }
                    })
                    navigate("/tasks")
                }
            }}
            >borrar</button>)}
        </div>
    )
}