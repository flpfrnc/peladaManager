import { useState } from "react";
import { useNavigate } from "react-router";
import { FaUsers, FaCheck } from "react-icons/fa6";
import { VscLoading } from "react-icons/vsc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../api";
import Button from "../../components/button";
import Input from "../../components/input";
import BackButton from "../../components/back-button";

const schema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
});

type FormData = z.infer<typeof schema>;

const CreateGroup = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsCreating(true);
      const result = await api.createGroup(data.name);
      if (!result) {
        form.setError("root", {
          type: "manual",
          message: "Erro ao criar grupo",
        });
        return;
      }

      navigate(`/grupos/${result.id}`);
    } catch {
      form.setError("root", {
        type: "manual",
        message: "Erro ao criar grupo",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
    <BackButton to="/grupos" />
    <div className="tw-flex-1 tw-flex tw-flex-col tw-gap-6 tw-max-w-md tw-mx-auto tw-w-full tw-px-4">
      
      <h1 className="tw-text-2xl tw-font-bold tw-text-center tw-flex tw-items-center tw-justify-center tw-gap-2">
        <FaUsers /> Criar Novo Grupo
      </h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="tw-flex tw-flex-col tw-gap-4">
        <div className="tw-flex tw-flex-col tw-gap-2">
          <label htmlFor="name">Nome do grupo:</label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Ex: Pelada de Domingo"
          />
          {form.formState.errors.name && (
            <p className="tw-text-red-500 tw-text-sm">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {form.formState.errors.root && (
          <p className="tw-text-red-500 tw-text-sm">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button
          type="submit"
          className="tw-bg-emerald-400 tw-py-[14px]"
          disabled={isCreating}
        >
          {isCreating ? (
            <VscLoading className="tw-animate-spin" />
          ) : (
            <FaCheck />
          )}
          Criar grupo
        </Button>
      </form>
    </div>
    </>
  );
};

export default CreateGroup;
