// src/controller/categories.controller.js
import express from "express";
import { ValidationError, NotFoundError } from "../domain/errors.js";

export class CategoriesController {
  constructor(categoriesService) {
    this.categories = categoriesService;
  }

  getRouter = () => {
    const router = express.Router();
    router.get("/", this.getAll);
    router.post("/", express.json(), this.createOne);
    router.get("/:id", this.getById);
    router.delete("/:id", this.deleteOne);
    return router;
  };

  getAll = async (req, res) => {
    const categories = await this.categories.getAll();
    res.json(categories);
  };

  createOne = async (req, res) => {
    const category = await this.categories.createOne({ name: req.body.name });
    res.status(201).json(category);
  };

  getById = async (req, res) => {
    const category = await this.categories.getById(req.params.id);
    res.json(category);
  };

  deleteOne = async (req, res) => {
    await this.categories.deleteOne(req.params.id);
    res.status(204).send();
  };
}
