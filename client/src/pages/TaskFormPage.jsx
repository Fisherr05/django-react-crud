import {useForm} from "react-hook-form";
import {createTask, deleteTask, getTask, updateTask} from "../api/tasks.api.js";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect} from "react";
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
        <div className="max-w-xl mx-auto">
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="title" name="" id=""
                       {...register("title", {required: true})}
                       className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
                />
                {errors.title &&
                    <span>Este campo es requerido</span>
                }
                <textarea rows="3" placeholder="description"
                          {...register("description", {required: true})}
                          className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
                ></textarea>
                {errors.description &&
                    <span>Este campo es requerido</span>
                }
                <button className="bg-indigo-500 p-3 rounded-lg block w-full mt-3">
                    guardar
                </button>
            </form>
            {params.id && (
                <div className="flex justify-end">
                    <button
                        className="bg-red-500 p-3 rouded-lg w-48 mt-3"
                        onClick={async () => {
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
                    >
                        borrar
                    </button>
                </div>
            )}
        </div>
    )
}