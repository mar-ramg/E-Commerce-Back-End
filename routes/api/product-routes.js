const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  Product.findAll({
    attributes: ['id', 'product_name', 'price', 'stock'],
    include: [
      {
        model: Category,
        attributes: ['category_name']
      },
      {
        model: Tag,
        attributes: ['tag_name']
      }
    ]
  })
    .then(dbProductData => res.json(dbProductData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    // find a single product by its `id`
    // be sure to include its associated Category and Tag data
    Product.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'product_name', 'price', 'stock'],
      include: [
        {
          model: Category,
          attributes: ['category_name']
        },
        {
          model: Tag,
          attributes: ['tag_name']
        }
      ]
    })
      .then(dbProductData => {
        if (!dbProductData) {
          res.status(404).json({message: 'No product found with this id'});
          return;
        }
        res.json(dbProductData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

router.post('/', (req, res) => {
    Product.create({
       product_name: req.body.product_name,
       price: req.body.price,
       stock: req.body.stock,
       category_id: req.body.category_id,
       tagIds: req.body.tagIds
       })
       .then((product) => {
         // if there's product tags, we need to create pairings to bulk create in the ProductTag model
         if (req.body.tagIds.length) {
           const productTagIdArr = req.body.tagIds.map((tag_id) => {
             return {
               product_id: product.id,
               tag_id,
             };
           });
           return ProductTag.bulkCreate(productTagIdArr);
         }
         // if no product tags, just respond
         res.status(200).json(product);
       })
       .then((productTagIds) => res.status(200).json(productTagIds))
       .catch((err) => {
         console.log(err);
         res.status(400).json(err);
       });
   });