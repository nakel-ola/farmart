/* eslint-disable @next/next/no-img-element */
import { gql, NetworkStatus, useLazyQuery, useQuery } from "@apollo/client";
import clsx from "clsx";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import Lottie from "react-lottie-player";
import NumberFormat from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import { GraphQLProductResponse, ProductType } from "../../../typing";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import TableContent from "../../components/TableContent";
import TableHeader from "../../components/TableHeader";
import TableList from "../../components/TableList";
import TableRow from "../../components/TableRow";
import lottieJson from "../../data/lf30_editor_mh2nforn.json";
import truncate from "../../helper/truncate";
import { roundUp } from "../../pages/orders";
import { selectCatagory } from "../../redux/features/categorySlice";
import { add } from "../../redux/features/dialogSlice";

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
        image {
          name
          url
        }

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
        image {
          name
          url
        }
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
        rating
        updatedAt
        createdAt
      }
    }
  }
`;

const tableList: string[] = ["Name", "Price", "Category", "Stock", "Updated"];

let limit = 10;

const ProductCards = ({ canEdit }: { canEdit: boolean }) => {
  const category = useSelector(selectCatagory);
  const router = useRouter();
  const dispatch = useDispatch();
  const sortList = [
    "All",
    ...category.map((item: { name: string }) => item.name),
  ];
  const [active, setActive] = useState(sortList[0]);

  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");
  const [data, setData] = useState<GraphQLProductResponse>();

  const { refetch } = useQuery<GraphQLProductResponse>(ProductQuery, {
    variables: {
      input: {
        genre: active === "All" ? null : active.toLowerCase(),
        offset: 0,
        limit,
        outOfStock: router.query?.type === "outofstock" ? true : false,
      },
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data: GraphQLProductResponse) => {
      setData(data);
    },
    onError: (data) => console.table(data),
  });

  const [productSearch] = useLazyQuery(SearchQuery, {
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
  });

  // const isRefetch = networkStatus === NetworkStatus.refetch;

  let pageCount = roundUp(Math.abs(data?.products.totalItems! / limit));

  const handlePageChange = async (e: ChangeEvent, page: number) => {
    setPage(page);

    let isSearch = !sortList.includes(data?.products.genre!);

    let offset = limit * (page - 1);

    if (isSearch) {
      productSearch({
        variables: {
          input: {
            search: input,
            offset,
            limit,
          },
        },
      });
    } else {
      await refetch({
        input: { genre: active, limit, offset },
      });
    }
  };

  const handleSortClick = async (
    event: MouseEvent<HTMLDivElement>,
    selected: string
  ) => {
    if (selected !== active) {
      setActive(selected);
    }
  };

  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await productSearch({
      variables: {
        input: {
          search: input,
          offset: 0,
          limit,
          outOfStock: router.query?.type === "outofstock" ? true : false,
        },
      },
    });
  };

  return (
    <Table>
      <TableHeader
        title="List of Products"
        toggle
        showSearch={true}
        searchValue={input}
        onSearchSubmit={handleSearchSubmit}
        onSearchChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
        leftComponent={
          canEdit ? (
            <Button
              className="text-green-600 bg-green-600/10"
              onClick={() =>
                dispatch(add({ open: true, data: null, type: "edit" }))
              }
            >
              Create product
            </Button>
          ) : null
        }
        placeholder="Search by product name"
        tableList={tableList}
        onSortClick={handleSortClick}
        sortList={sortList}
      />

      {data?.products.results.length! > 0 ? (
        <>
          <TableList>
            {data?.products.results.map(
              (product: ProductType, index: number) => (
                <TableRow
                  key={index}
                  onClick={() => router.push(`/product/${product.slug}`)}
                >
                  <TableContent>
                    <div className="flex items-center">
                      <img
                        src={product.image.url}
                        alt=""
                        className="h-[40px] w-[40px] rounded-lg object-cover"
                      />
                      <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
                        {truncate(product.title, 8)}
                      </p>
                    </div>
                  </TableContent>

                  <TableContent>
                    <NumberFormat
                      thousandSeparator
                      displayType="text"
                      value={product.price.toFixed(2)}
                      prefix={product.currency.symbol}
                      renderText={(value) => (
                        <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
                          {value}
                        </p>
                      )}
                    />
                  </TableContent>
                  <TableContent>
                    <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
                      {product.category}
                    </p>
                  </TableContent>
                  <TableContent>
                    <p
                      className={clsx(
                        "text-[0.9rem] font-medium whitespace-nowrap ml-2",
                        product.stock > 0
                          ? "text-neutral-800 dark:text-neutral-300 "
                          : "text-red-600"
                      )}
                    >
                      {product.stock > 0 ? product.stock : "Out of stock"}
                    </p>
                  </TableContent>
                  <TableContent>
                    <p className="text-[0.9rem] font-medium text-neutral-800 dark:text-neutral-300 whitespace-nowrap ml-2">
                      {new Date(product.updatedAt).toDateString()}
                    </p>
                  </TableContent>
                </TableRow>
              )
            )}
          </TableList>

          <div className="grid place-items-center w-full">
            {pageCount > 1 && (
              <Pagination
                pageCount={pageCount}
                forcePage={page}
                pageRangeDisplayed={10}
                breakLabel="•••"
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </>
      ) : (
        <div className="flex-[0.35] ml-[5px] h-[80%] grid place-items-center my-5">
          <div className="flex items-center justify-center flex-col ">
            <Lottie
              loop={false}
              animationData={lottieJson}
              play
              style={{ width: 250, height: 250 }}
            />
            <p className="text-[1.2rem] text-slate-900 dark:text-white">
              No Users Yet!
            </p>
          </div>
        </div>
      )}
    </Table>
  );
};

export interface HtmlDivElement {
  current: HTMLDivElement;
}

export default ProductCards;
