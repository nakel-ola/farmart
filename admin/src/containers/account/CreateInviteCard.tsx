import { gql, useMutation } from "@apollo/client";
import { ChangeEvent, FormEvent, useState } from "react";
import Button from "../../components/Button";
import InputCard from "../../components/InputCard";
import InputDropdown from "../../components/InputDropdown";
import LoadingCard from "../../components/LoadingCard";
import PopupTemplate from "../../components/PopupTemplate";
import { emailRegex } from "../home/LogInCard";

type FormType = {
  email: string;
  level: string;
};

const CreateInvite = gql`
  mutation CreateEmployeeInvite($input: CreateEmployeeInviteInput!) {
    createEmployeeInvite(input: $input) {
      message
    }
  }
`;

const validate = (form: FormType): boolean => {
  const { email, level } = form;

  if (email.match(emailRegex) && (level === "Gold" || "Silver" || "Bronze")) return false;
  

  return true;
};

interface Props {
  func(): void;
  onClose(): void;
}
const CreateInviteCard: React.FC<Props> = ({ func,onClose }) => {

  const [form, setForm] = useState<FormType>({
    email: "",
    level: "",
  });

  const [createEmployeeInvite, { loading }] = useMutation(CreateInvite);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await createEmployeeInvite({
      variables: { input: form },
      onCompleted: (data) => {
        func?.();
        onClose();
      },
      onError: (err) => console.table(err)
    });
  };

  return (
    <PopupTemplate title="Create Invite" onOutsideClick={onClose}>
      {!loading ? (
        <form
          onSubmit={handleSubmit}
          className="pb-[10px] grid place-items-center"
        >
          <InputCard
            title="Email"
            id="email"
            name="email"
            type="text"
            value={form.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <InputDropdown
            list={["Gold", "Silver", "Bronze"]}
            title="Level"
            id="level"
            name="level"
            type="text"
            value={form.level}
            onChange={(value: string) => setForm({ ...form, level: value })}
          />

          <div className="flex items-center justify-center  mt-5">
            <Button
              type="button"
              className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white mx-2"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={validate(form)}
              className="bg-primary text-white mx-2"
            >
              Send Invite
            </Button>
          </div>
        </form>
      ) : (
        <LoadingCard title="Sending invite" />
      )}
    </PopupTemplate>
  );
};

export default CreateInviteCard;
