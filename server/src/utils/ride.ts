import { Ride } from "../models/Ride";

export function validateRideData(rideData: Ride): string | null {
  // Validate userId
  if (typeof rideData.userId !== "string" || rideData.userId.trim() === "") {
    return "Invalid User ID";
  }

  // Validate carId
  if (typeof rideData.carId !== "string" || rideData.carId.trim() === "") {
    return "Invalid Car ID";
  }

  // Validate noOfSeats
  if (
    typeof rideData.noOfSeats !== "number" ||
    rideData.noOfSeats <= 0 ||
    !Number.isInteger(rideData.noOfSeats)
  ) {
    return "Invalid Number of Seats";
  }

  // Validate seatsLeft
  if (
    typeof rideData.seatsLeft !== "number" ||
    rideData.seatsLeft < 0 ||
    !Number.isInteger(rideData.seatsLeft)
  ) {
    return "Invalid Seats Left";
  }

  // Validate pickUp location
  if (
    !rideData.pickUp ||
    typeof rideData.pickUp !== "object" ||
    typeof rideData.pickUp.location !== "object" ||
    typeof rideData.pickUp.location.lat !== "number" ||
    typeof rideData.pickUp.location.long !== "number"
  ) {
    return "Invalid Pickup Location";
  }

  // Validate dropOff location
  if (
    !rideData.dropOff ||
    typeof rideData.dropOff !== "object" ||
    typeof rideData.dropOff.location !== "object" ||
    typeof rideData.dropOff.location.lat !== "number" ||
    typeof rideData.dropOff.location.long !== "number"
  ) {
    return "Invalid Dropoff Location";
  }

  // Validate isAvailable
  if (
    rideData.isAvailable !== undefined &&
    typeof rideData.isAvailable !== "boolean"
  ) {
    return "Invalid Availability";
  }

  return null;
}
