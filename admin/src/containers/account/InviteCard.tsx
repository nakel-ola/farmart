import { gql, useMutation } from "@apollo/client";
import clsx from "clsx";
import { AnimatePresence } from "framer-motion";
import { SmsStar, Trash } from "iconsax-react";
import React, { useState } from "react";
import { InviteType } from "../../../typing";
import Button from "../../components/Button";
import DeleteCard from "../../components/DeleteCard";
import {
  Table,
  TableBody,
  TableContent,
  TableHead,
  TableRow,
} from "../../components/tables";
import Header from "../../components/tables/Header";
import { statusColor } from "../../helper/statusColor";
import { useSession } from "next-auth/react";
import CreateInviteCard from "./CreateInviteCard";

interface Toggle {
  createInvite: boolean;
  deleteInvite: false | string;
}
const InviteCard = ({ data, func }: { data: InviteType[]; func: any }) => {
  const { data: sessionData } = useSession()
  const user = sessionData?.user;

  const [toggle, setToggle] = useState<Toggle>({
    createInvite: false,
    deleteInvite: false,
  });

  let tableList = [
    { title: "Email", className: "flex-1" },
    { title: "Level", className: "flex-1" },
    { title: "Status", className: "flex-1" },
    { title: "Created At", className: "flex-1" },
    { title: "", className: "flex-1" },
  ];

  const [deleteEmployeeInvite, { loading }] = useMutation(DeleteInvite);

  const reset = () => setToggle({ createInvite: false, deleteInvite: false });

  const handleDelete = async () => {
    if (typeof toggle.deleteInvite === "boolean") return;

    await deleteEmployeeInvite({
      variables: { id: toggle.deleteInvite },
      onCompleted: () => {
        func();
        reset();
      },
      onError: (err) => console.table(err),
    });
  };

  return (
    <>
      <div className="w-[95%] md:w-[80%]">
        <Table
          headerComponent={
            <Header
              width="w-[580px]"
              title="Invites"
              showSearch={false}
              rightComponent={
                user?.level === "Gold" ? (
                  <Button
                    className="text-green-600 bg-green-600/10 mr-2"
                    onClick={() => setToggle({ ...toggle, createInvite: true })}
                  >
                    Send Invite
                  </Button>
                ) : null
              }
            />
          }
        >
          <TableHead tableList={tableList} />

          {data.length > 0 ? (
            <TableBody disableDivider>
              {data.map((item: InviteType, index: number) => (
                <Card
                  key={index}
                  {...item}
                  onDelete={() =>
                    setToggle({ ...toggle, deleteInvite: item.id })
                  }
                />
              ))}
            </TableBody>
          ) : null}
        </Table>

        {data.length === 0 && (
          <div className="w-full">
            <div className="flex flex-col items-center justify-center m-2 my-8 ">
              <SmsStar
                size={100}
                className="text-5xl text-neutral-700 dark:text-neutral-400"
              />
              <p className="text-black dark:text-white text-lg">
                No invite yet!
              </p>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {toggle.createInvite && (
          <CreateInviteCard func={func} onClose={reset} />
        )}

        {toggle.deleteInvite && (
          <DeleteCard
            loading={loading}
            message="Are you sure you want to delete the invite ?"
            onClose={reset}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const DeleteInvite = gql`
  mutation DeleteEmployeeInvite($id: ID!) {
    deleteEmployeeInvite(id: $id) {
      message
    }
  }
`;

interface Props extends InviteType {
  onDelete(): void;
}

const Card: React.FC<Props> = (props) => {
  const { email, level, status, createdAt, onDelete } = props;

  const { data } = useSession()
  const user = data?.user;

  return (
    <TableRow>
      <TableContent>
        <p className="text-base text-neutral-700 dark:text-neutral-400 whitespace-nowrap">
          {email}
        </p>
      </TableContent>

      <TableContent>
        <p className="text-base text-neutral-700 dark:text-neutral-400 whitespace-nowrap">
          {level}
        </p>
      </TableContent>
      <TableContent>
        <p
          className={clsx(
            "text-base dark:text-neutral-400 whitespace-nowrap ",
            statusColor(status)
          )}
        >
          {status}
        </p>
      </TableContent>
      <TableContent>
        <p className="text-base text-neutral-700 dark:text-neutral-400 whitespace-nowrap">
          {new Date(createdAt).toDateString()}
        </p>
      </TableContent>

      <TableContent className="text-right float-right">
        <button
          className="w-[35px] mr-2 flex items-center  justify-center"
          onClick={onDelete}
        >
          {user?.level === "Gold" && (
            <Trash size={25} className="text-red-600" />
          )}
        </button>
      </TableContent>
    </TableRow>
  );
};

export default InviteCard;
