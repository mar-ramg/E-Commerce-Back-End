const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
    }
  })
    .then(dbCatData => {
      if(!dbCatData) {
        res.status(404).json({message: 'No categories found'});
        return;
      }
      res.json(dbCatData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err)
    });
});

