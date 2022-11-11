import clsx from "clsx";
import { SmsStar, Trash } from "iconsax-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { InviteType } from "../../../typing";
import Button from "../../components/Button";
import {
    Table,
    TableBody,
    TableContent,
    TableHead,
    TableRow
} from "../../components/tables";
import Header from "../../components/tables/Header";
import { statusColor } from "../../helper/statusColor";
import { add } from "../../redux/features/dialogSlice";
import { selectUser } from "../../redux/features/userSlice";

const InviteCard = ({ data, func }: { data: InviteType[]; func: any }) => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const handleDelete = async (id: string) => {
    dispatch(
      add({
        type: "delete",
        data: {
          message: "Are you sure you want to delete the invite ?",
          id,
        },
        open: true,
      })
    );
  };

  let tableList = [
    { title: "Email", className: "w-full" },
    { title: "Level", className: "w-full" },
    { title: "Status", className: "w-full" },
    { title: "Created At", className: "w-full" },
    { title: "", className: "w-full" },
  ];

  return (
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
                  onClick={() =>
                    dispatch(
                      add({
                        open: true,
                        data: null,
                        type: "invite",
                      })
                    )
                  }
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
              <TableRow key={index}>
                <TableContent>
                  <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                    {item.email}
                  </p>
                </TableContent>

                <TableContent>
                  <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                    {item.level}
                  </p>
                </TableContent>
                <TableContent>
                  <p
                    className={clsx(
                      "text-[0.9rem] font-medium dark:text-neutral-300 whitespace-nowrap ",
                      statusColor(item.status)
                    )}
                  >
                    {item.status}
                  </p>
                </TableContent>
                <TableContent>
                  <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                    {new Date(item.createdAt).toDateString()}
                  </p>
                </TableContent>

                <TableContent className="text-right float-right">
                  <button
                    className="w-[35px] mr-2 flex items-center  justify-center"
                    onClick={() => handleDelete(item.id)}
                  >
                    {user?.level === "Gold" && (
                      <Trash size={25} className="text-red-600" />
                    )}
                  </button>
                </TableContent>
              </TableRow>
            ))}
          </TableBody>
        ) : null}
      </Table>
      {/* <Table>
        <TableHeader
          title="Invites"
          showSearch={false}
          tableList={["Email", "Level", "Status", "Created At", ""]}
          leftComponent={
            user?.level == "Gold" ? (
              <Button
                className="text-green-600 bg-green-600/10"
                onClick={() =>
                  dispatch(
                    add({
                      open: true,
                      data: null,
                      type: "invite",
                    })
                  )
                }
              >
                Send Invite
              </Button>
            ) : null
          }
        />

        {data.length > 0 ? (
          <TableList>
            {data.map((item: InviteType, index: number) => (
              <TableRow key={index}>
                <TableContent>
                  <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
                    {item.email}
                  </p>
                </TableContent>

                <TableContent>
                  <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
                    {item.level}
                  </p>
                </TableContent>
                <TableContent>
                  <p className={clsx("text-[0.9rem] font-medium dark:text-neutral-300 whitespace-nowrap ml-2", statusColor(item.status))}>
                    {item.status}
                  </p>
                </TableContent>
                <TableContent>
                  <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
                    {new Date(item.createdAt).toDateString()}
                  </p>
                </TableContent>

                <button
                  className="w-[35px] mr-2 flex items-center justify-center"
                  onClick={() => handleDelete(item.id)}
                >
                  {user?.level === "Gold" && (
                    <Trash size={25} className="text-red-600" />
                  )}
                </button>
              </TableRow>
            ))}
          </TableList>
        ) : (
          <div className="w-full bg-white dark:bg-dark mt-2 rounded-lg shadow-sm">
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
      </Table> */}
    </div>
  );
};

export default InviteCard;
