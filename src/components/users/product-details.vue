<template>
  <div class="main-div">
    <Navbar />
    <div class="wrapper">
      <!-- Container Starts -->
      <div class="container" v-if="!isLoading">
        <div class="row">
          <div class="col-12">
            <div class="alert alert-danger" role="alert" v-if="error">
              {{ error }}
            </div>
          </div>
          <!-- product img div Starts -->
          <div class="col-md-6 col-12">
            <div class="product-details-img">
              <img :src="product.imagePath" alt="Product Image">
            </div>
            <div class="product-details-buttons">
              <button
                class="btn btn-primary"
                @click="addToCart(product.id)"
              >ADD TO CART</button>

              <button 
                class="btn btn-primary ml-2"
                @click="addToWishList(product.id)"
              >ADD TO WISHLIST</button>
            </div>
          </div>
          <!-- product img div end -->

          <!-- product details div starts -->
          <div class="col-md-6 col-12">
            <div class="product-details">
              <div class="product-title">
                <h4>{{ product.title }}</h4>
              </div>

              <div class="product-price">
                <p>&#8377;&nbsp;{{ product.price }}</p>
              </div>

              <!-- product info div starts -->
              <div class="product-info">
                <div class="product-info-line">
                  <p style="text-align: left">Description<span style="float: right">{{ product.description }}</span></p>
                </div>
                <hr>
                <div class="product-info-line">
                  <p style="text-align: left">Brand<span style="float: right">{{ product.brandName }}</span></p>
                </div>
                <hr>
                <div class="product-info-line">
                  <p style="text-align: left">Category<span style="float: right">{{ product.category.title }}</span></p>
                </div>
              </div>
              <!-- product info div end -->
            </div>
          </div>
          <!-- product details div ends -->
        </div>
      </div>
      <!-- Container Ends -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '../shared/navbar.vue';

export default {
  name: 'ProductDetailsUser',
  components: { Navbar },
  data() {
    return {
      isAuthenticated: this.$store.getters.authStatus,
      product: null,
      isLoading: true,
      error: null
    };
  },

  methods: {
    async getProduct() {
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/shop/products/${this.$route.params.id}`);

        if(response.data.success) {
          this.product = response.data.payload;
          this.isLoading = false;
        }
      } catch (error) {
        console.log(error)
        this.error = error.response.data.message;
      }
    },

    async addToCart(productId) {
      if(!this.isAuthenticated) {
        this.error = 'Please login to purchase products!'
        return;
      }
      try {
        const response = await this.$store.dispatch('addToCart', productId);
        if(response.data.success) {
          this.$router.push('/user/cart');
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    async addToWishList(productId) {
      if(!this.isAuthenticated) {
        return;
      }
      try {
        const response = await this.$store.dispatch('addToWishList', productId);
        if(response.data.success) {
          this.$router.push('/user/wishlist');
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.log(error.response);
      }
    }
  },

  created() {
    this.getProduct();
  }
}
</script>

<style scoped>
  .wrapper {
    max-width: 1450px;
    height: 100%;
    margin-top: 150px;
    margin-left: auto;
    margin-right: auto;
  }

  .container {
    min-width: 100% !important;
  }

  .alert {
    height: 40px;
    display: flex;
    align-items: center;
  }

  .product-details-img {
    height: 400px;
    width: 100%;
    text-align: center;
  }

  .product-details-img img {
    max-width: 100%;
    height: 400px;
    object-fit: contain;
  }

  .product-details {
    margin-top: 50px;
    margin-bottom: 50px;
  }

  .product-title {
    background-color: #007bff;
    height: 60px;
    margin-bottom: 20px;
  }

  .product-title h4 {
    color: #ffffff;
    font-size: 40px;
    line-height: 60px;
    padding-left: 10px;
  }

  .product-details-buttons {
    margin-top: 30px;
    text-align: center;
  }

  .product-details-buttons button {
    width: 160px;
  }

  .product-price p {
    font-size: 30px;
    line-height: 30px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .product-info {
    border: 1px solid rgba(0,0,0,.1);
    border-radius: 3px;
  }

  hr {
    margin: 0;
  }

  .product-info-line {
    height: 60px;
  }

  .product-info-line p {
    font-size: 20px;
    line-height: 60px;
    padding: 0 15px;
  }

  @media (max-width: 992px) {
    .product-details .product-info-line p {
      font-size: 16px;
    }
  }

  @media (max-width: 576px) {
    .wrapper {
      margin-top: 100px;
    }

    .product-title {
      height: 40px;
    }

    .product-title h4 {
      font-size: 24px;
      line-height: 40px;
    }

    .product-price p {
      font-size: 20px;
    }

    .product-details-buttons button {
      font-size: 12px;
      width: 130px;
    }
  }
</style>