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
    update: "/ride/update",
    delete: "/ride/delete/:id",
    cancel: "/ride/cancel/:id",
    book: "/ride/book",
    add: "/ride/add",
    rideDetails: "/ride/ride-details",
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
};

export default routes;
