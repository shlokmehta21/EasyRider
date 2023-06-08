import { Model, Document } from "mongoose";

class IDb<T extends Document, M extends Model<T, {}>> {
  private model: M;

  constructor(model: M) {
    this.model = model;
  }

  getModel(): Model<T> {
    return this.model as Model<T>;
  }

  async findOneByParams(params: object): Promise<T | null> {
    try {
      const obj: T | null = await this.model.findOne(params);
      if (obj !== null) {
        return obj;
      } else return null;
    } catch (err) {
      throw new Error("Failed to find the object using Params");
    }
  }

  async findByParamsAndUpdate(
    params: object,
    updateFields: object
  ): Promise<Boolean> {
    try {
      const updateResult = await this.model.updateMany(params, updateFields);
      if (updateResult.modifiedCount > 0) {
        return true;
      }
      return false;
    } catch (err) {
      throw new Error("Failed to update the object");
    }
  }

  async findByParams(params: object): Promise<T[] | null> {
    try {
      const obj: T[] = await this.model.find(params);
      if (obj !== null) {
        return obj;
      } else return null;
    } catch (err) {
      throw new Error("Failed to find the object list using Params");
    }
  }

  async findIfExists(params: object): Promise<boolean> {
    try {
      const obj = await this.model.findOne(params);
      if (obj !== null) {
        return true;
      } else return false;
    } catch (err) {
      throw new Error("Failed to find if object exists");
    }
  }
}

export default IDb;
