import { gql, useQuery } from "@apollo/client";
import { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { add } from "../redux/features/categorySlice";


export const CategoriesQuery = gql`
  query Categories {
    categories {
      name
    }
  }
`;

const Wrapper = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();

  useQuery(CategoriesQuery, {
    onCompleted: (data) => dispatch(add([{ name: "All" }, ...data.categories])),
  });

  return (
    <div className=" bg-white dark:bg-dark mx-auto w-full max-w-7xl">
      {children}
    </div>
  );
};

export default Wrapper;
