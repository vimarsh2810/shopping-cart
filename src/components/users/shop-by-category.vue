<template>
  <div class="main-div">
    <Navbar />
    <div class="wrapper" style="margin-top: 100px">
      <div class="container">
        <h3 class="mbpx-30px">{{ categoryTitle }}</h3>
        <div class="row">

          <div class="col-lg-3 col-md-4 col-sm-6 col-12 mbpx-30px" v-for="product in products" :key="product.id">
            <div class="card">
              <div class="card-product-img">
                <img :src="product.imagePath" alt="">
              </div>
              <div class="card-product-details">
                <h4>{{ product.title }}</h4>
                <!-- <p style="text-align: right;"><span class=" d-inline-flex align-items-center badge badge-success" style="float: left;">4.5&nbsp;&#11088;</span>&#8377;{{ product.price }}</p> -->
                <p><span class=" d-inline-flex align-items-center badge badge-success">4.5&nbsp;&#11088;</span>&nbsp;&nbsp;&nbsp;&#8377;{{ product.price }}</p>
              </div>
              <div class="card-product-btn">
                <button class="btn btn-primary material-button" @click="addToCart(product.id)">ADD TO CART</button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import Navbar from '../shared/navbar.vue';
export default {
  name: 'ShopByCategory',
  components: { Navbar },
  props: ['id'],
  data() {
    return {
      categoryTitle: '',
      products: []
    };
  },
  methods: {
    async getProductsByCategory() {
      try {
        const response = await axios.get(`http://localhost:3000/shop/getProductsByCategory/${this.$route.params.id}`, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        this.products = response.data.payload.products;
        this.categoryTitle = response.data.payload.title;
      } catch (error) {
        console.log(error.response);
      }
    },

    async addToCart(productId) {
      try {
        const data = {
          productId: productId,
          quantity: 1
        };
        const response = await axios.post('http://localhost:3000/cart/addToCart', data, {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.token}`
          }
        });
        if(response.data.success) {
          this.$router.push('/user/cart');
        }
      } catch (error) {
        console.log(error.response);
      }
    }
  },
  created() {
    this.getProductsByCategory();
  }
}
</script>

<style scoped>
  .wrapper {
    max-width: 1450px;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .mbpx-30px {
    margin-bottom: 30px;
  }

  .container {
    min-width: 100% !important;
  }

  .card {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .card-product-img {
    height: 280px;
    max-width: 330.5px;
    padding: 20px;
    display:flex;
    align-items:center;
    justify-content:center;
    margin-left: auto;
    margin-right: auto;
  }

  .card-product-img img {
    max-height: 100%;
    max-width: 100%;
    transition: all 0.15s ease-in-out;
    object-fit: cover;
  }

  .card-product-img img:hover {
    cursor: pointer;
    transform: scale(1.03);
  }

  .card-product-details h4 {
    text-align: center;
    padding-left: 20px;
    padding-right: 20px;
    text-overflow: ellipsis;
    white-space: nowrap; 
    overflow: hidden;
  }

  .card-product-details h4:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  .card-product-details p {
    font-weight: 600;
    text-align: center;
  }
  span {
    display: inline-block;
    height: 24px;
  }

  .card-product-btn {
    margin-left: auto;
    margin-right: auto;
  }

  .material-button {
    box-shadow: 0 2px 4px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.23);
    margin-bottom: 15px;
    width: 200px;
  }

  .form-control:focus,
  .btn:focus {
    box-shadow:none !important;
  }
</style>