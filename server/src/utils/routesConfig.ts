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
    update: "/car/update",
    delete: "/car/delete/:id",
    cancel: "/car/cancel/:id",
    book: "/car/book",
    add: "/car/add",
    rideDetails: "/car/ride-details",
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
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password/:token",
  },
};

export default routes;
