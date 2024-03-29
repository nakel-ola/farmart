/* eslint-disable @next/next/no-img-element */
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import clsx from "clsx";
import { Bag2 } from "iconsax-react";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { AnimatePresence } from "framer-motion";
import { NumericFormat, numericFormatter } from "react-number-format";
import { useSelector } from "react-redux";
import { GraphQLProductResponse, ProductType } from "../../../typing";
import Button from "../../components/Button";
import LoadingCard from "../../components/LoadingCard";
import Pagination from "../../components/Pagination";
import {
  Table,
  TableBody,
  TableContent,
  TableHead,
  TableRow,
} from "../../components/tables";
import Header from "../../components/tables/Header";
import truncate from "../../helper/truncate";
import { roundUp } from "../../pages/orders";
import { selectCatagory } from "../../redux/features/categorySlice";
import Popup from "./Popup";

const ProductQuery = gql`
  query Products($input: ProductsInput) {
    products(input: $input) {
      totalItems
      genre
      results {
        id
        title
        price
        category
        stock
        updatedAt
        slug
        image

        currency {
          symbol
        }
      }
    }
  }
`;

const SearchQuery = gql`
  query ProductSearch($input: ProductSearchInput!) {
    productSearch(input: $input) {
      totalItems
      search
      results {
        id
        title
        slug
        category
        description
        image
        currency {
          name
          code
          rounding
          symbolNative
          decimalDigits
          symbol
          namePlural
        }
        price
        stock
        rating {
          name
          value
        }
        updatedAt
        createdAt
      }
    }
  }
`;

const tableList: any[] = [
  { title: "Name", className: "w-56 md:w-20" },
  { title: "Price", className: "w-20" },
  { title: "Category", className: "w-24" },
  { title: "Stock", className: "w-24" },
  { title: "Updated", className: "w-32" },
];

let limit = 10;

interface Props {
  canEdit: boolean;
}

const ProductCards = ({ canEdit }: Props) => {
  const category = useSelector(selectCatagory);
  const router = useRouter();
  const sortList = [
    "All",
    ...category.map((item: { name: string }) => item.name),
  ];
  const [active, setActive] = useState(sortList[0]);

  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");
  const [data, setData] = useState<GraphQLProductResponse | null>(null);
  const [toggle, setToggle] = useState(false);

  const outOfStock = router.query?.type === "outofstock" ? true : false,
    genre = active === "All" ? null : active.toLowerCase();

  const { refetch, loading: productLoading } = useQuery<GraphQLProductResponse>(
    ProductQuery,
    {
      variables: { input: { genre, offset: 0, limit, outOfStock } },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      onCompleted: (data: GraphQLProductResponse) => setData(data),
      onError: (data) => console.table(data),
    }
  );

  const [productSearch, { loading: searchLoading }] = useLazyQuery(
    SearchQuery,
    {
      fetchPolicy: "network-only",
      onCompleted: ({ productSearch }) => {
        setData({
          products: {
            results: productSearch.results,
            genre: productSearch.search,
            totalItems: productSearch.totalItems,
          },
        });
      },
      onError: (err) => console.table(err),
    }
  );

  let pageCount = roundUp(Math.abs(data?.products.totalItems! / limit));

  const handlePageChange = async (e: ChangeEvent, page: number) => {
    setPage(page);

    const offset = limit * (page - 1);

    if (input.length > 0)
      await productSearch({
        variables: { input: { search: input, offset, limit } },
      });
    else await refetch({ input: { genre, limit, offset } });
  };

  const handleSortClick = async (_: any, selected: string) => {
    if (selected !== active) setActive(selected);
  };

  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await productSearch({
      variables: { input: { search: input, offset: 0, limit, outOfStock } },
    });
  };

  let loading = productLoading || searchLoading;

  return (
    <>
      <div className="w-[95%] md:w-[90%]">
        <Table
          headerComponent={
            <Header
              width="w-[620px]"
              title="List of Products"
              toggle
              showSearch={true}
              searchValue={input}
              onSearchSubmit={handleSearchSubmit}
              onSearchChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              rightComponent={
                canEdit ? (
                  <Button
                    className="text-green-600 bg-green-600/10 mr-2"
                    onClick={() => setToggle(true)}
                  >
                    Create product
                  </Button>
                ) : null
              }
              placeholder="Search by product name"
              onSortClick={handleSortClick}
              sortList={sortList}
            />
          }
          footerComponent={
            pageCount > 1 ? (
              <Pagination
                width="w-[620px]"
                pageCount={pageCount}
                forcePage={page}
                pageRangeDisplayed={10}
                breakLabel="•••"
                onPageChange={handlePageChange}
              />
            ) : null
          }
        >
          <TableHead
            disableDivider={data?.products.results.length! > 0 ? false : true}
            tableList={tableList}
          />

          {!loading || data?.products.results.length! > 0 ? (
            <TableBody disableDivider={pageCount > 1 ? false : true}>
              {data?.products.results.map(
                (product: ProductType, index: number) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer"
                    onClick={() => router.push(`/product/${product.slug}`)}
                  >
                    <TableContent className="flex items-center w-56 md:w-fit">
                      <img
                        src={product.image}
                        alt=""
                        className="h-[40px] w-[40px] rounded-lg object-cover shrink-0"
                      />
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
                        {truncate(product.title, 15)}
                      </p>
                    </TableContent>
                    <TableContent>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                        {numericFormatter(product.price.toString(), {
                          thousandSeparator: true,
                          prefix: "$ "
                        })}
                      </p>
                    </TableContent>
                    <TableContent>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                        {product.category}
                      </p>
                    </TableContent>
                    <TableContent>
                      <p
                        className={clsx(
                          "text-sm font-medium whitespace-nowrap",
                          product.stock > 0
                            ? "text-neutral-800 dark:text-neutral-300 "
                            : "text-red-600"
                        )}
                      >
                        {product.stock > 0 ? product.stock : "Out of stock"}
                      </p>
                    </TableContent>
                    <TableContent>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap">
                        {new Date(product.updatedAt).toDateString()}
                      </p>
                    </TableContent>
                  </TableRow>
                )
              )}
            </TableBody>
          ) : null}
        </Table>

        {loading && (
          <LoadingCard title={searchLoading ? "Searching..." : "Loading..."} />
        )}

        {data?.products.results.length! === 0 && (
          <div className="grid my-10 place-items-center">
            <div className="flex items-center justify-center flex-col">
              <Bag2
                size={100}
                className="text-neutral-700 dark:text-neutral-400"
              />
              <p className="text-neutral-700 dark:text-neutral-400 text-lg font-semibold my-1">
                No Products Yet!
              </p>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {toggle && (
          <Popup
            onClose={() => setToggle(false)}
            func={() =>
              refetch({
                input: {
                  genre: active === "All" ? null : active.toLowerCase(),
                  limit,
                  offset: page === 0 ? 0 : limit * (page - 1),
                },
              })
            }
          />
        )}
      </AnimatePresence>
    </>
  );
};

export interface HtmlDivElement {
  current: HTMLDivElement;
}

export default ProductCards;
