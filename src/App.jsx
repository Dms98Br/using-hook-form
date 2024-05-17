import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod';

const createUserFormSchema = z.object({
  name: z.string().min(3, { message: 'É necessario um nome válido' }),
  email: z.string().email({ message: 'Formato de e-mail inválido' }),
  password: z.string().min(6, { message: 'Senha inválida' }),
  techs: z
    .array(
      z.object({
        title: z
          .string()
          .min(1, { message: 'Nome da tecnologia é obrigatoria' })
      })
    )
    .min(1, {
      message: "Devem ter ao menos 1 tecnologias.",
    }),
})

export function App() {
  const { register, handleSubmit, formState: { errors }, control } = useForm({ resolver: zodResolver(createUserFormSchema) })

  const { append, remove, fields } = useFieldArray({ name: 'techs', control })

  const [output, setOutput] = useState()

  function addNewTech() {
    append({ title: '' })

  }

  function createUser(data) {
    setOutput(JSON.stringify(data, null, 2));

  }
  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-6 items-center justify-center">
      <label className="text-sky-500 font-bold">
        Formulário usando React Hook Form
      </label>
      <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSubmit(createUser)}>
        <div className="flex flex-col gap-1">
          <label>Nome</label>
          <input
            type="text"
            {...register('name')}
            className="flex-1 rounded border bg-zinc-800 border-zinc-600 shadow-sm px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label>E-mail</label>
          <input
            type="email"
            {...register('email')}
            className="flex-1 rounded border bg-zinc-800 border-zinc-600 shadow-sm px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label>Senha</label>
          <input
            type="text"
            {...register('password')}
            className="flex-1 rounded border bg-zinc-800 border-zinc-600 shadow-sm px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="flex items-center justify-between">
            Tecnologias
            <button
              type="button"
              onClick={addNewTech}
              className="text-sky-500 text-xs"
            >
              Adicionar
            </button>
          </label>
        </div>
        {errors.techs && <span>{errors.techs.message}</span>}
        {
          fields.map((field, index) => (
            <div key={field.id} className="flex flex-col">
              <div className="flex gap-2">
                <select
                  id="techs-select"
                  className="flex-1 rounded border bg-zinc-800 border-zinc-600 shadow-sm px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  {...register(`techs.${index}.title`)}
                >
                  <option value="React">React</option>
                  <option value="Next">Next</option>
                  <option value="Node">Node</option>
                  <option value="C#">C#</option>
                </select>
                {errors.techs?.[index].title && <span>{errors.techs[index].title.message}</span>}
                <button
                  type="button"
                  onClick={() => { remove(index) }}
                  className="bg-red-500 text-white rounded px-3 h-10 font-semibold text-sm hover:bg-red-600"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))
        }

        <button
          type="submit"
          className="bg-sky-500 text-white rounded px-3 h-10 font-semibold text-sm hover:bg-sky-600"
        >
          Salvar
        </button>
      </form>

      {output && (
        <pre className="text-sm bg-zinc-800 text-zinc-100 p-6 rounded-lg">
          {output}
        </pre>
      )}
    </main>
  );
}
