import RouteConfig from "../models/interfaces/IRoute";

const routes: RouteConfig = {
  REGISTER: "/register",
  CAR: {
    default: "/car",
    register: "/car/register",
    update: "/car/update",
    delete: "/car/delete/:id",
  },
  RIDE: {
    default: "/ride",
    delete: "/ride/:id",
    cancel: "/ride/cancel/:id",
    book: "/ride/book",
    add: "/ride/add",
    rideDetails: "/ride/:id",
  },
  LOGIN: "/login",
  LOGOUT: "/logout",
  PASSWORD: "/reset-password",
  LOCATION: {
    default: "/location",
    update: "/location/update",
  },
  USER_PROFILE: {
    default: "/user",
    profilePicture: "/user/profile-picture/:id",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password/:token",
    update: "/user/profile",
    domainImages: "/user/domain-images",
    updateLocale: "/user/locale",
  },
  MESSAGE: {
    default: "/chat",
    unread: "/unread",
  },
  MY_RIDES: {
    default: "/my-trips",
  },
};

export default routes;
