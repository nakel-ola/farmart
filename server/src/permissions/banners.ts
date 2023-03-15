import { allow, and, inputRule, rule } from "graphql-shield";
import { isAdmin, isAuthenticated, isDashboard, isEditor } from "./user";

const createBannerInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      image: yup.string().required(),
      title: yup.string().required(),
      description: yup.string().required(),
      link: yup.string().nullable(),
    }),
  })
);

const editBannerInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      id: yup.string().required(),
      title: yup.string().required(),
      description: yup.string().required(),
      link: yup.string().nullable(),
      image: yup.string().nullable(),
    }),
  })
);
const deleteBannerInput = inputRule()((yup) =>
  yup.object({ id: yup.string().required() })
);

const bannerQuery = {
  banners: allow,
};

const bannerMutation = {
  createBanner: and(
    isDashboard,
    createBannerInput,
    isAuthenticated,
    isAdmin,
    isEditor
  ),
  editBanner: and(
    isDashboard,
    editBannerInput,
    isAuthenticated,
    isAdmin,
    isEditor
  ),
  deleteBanner: and(
    isDashboard,
    deleteBannerInput,
    isAuthenticated,
    isAdmin,
    isEditor
  ),
};

export { bannerQuery, bannerMutation };
