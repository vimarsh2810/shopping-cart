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
            <!-- <div class="product-details-img">
              <img :src="product.productImages[0].path" alt="Product Image">
            </div> -->
            <div id="carouselExampleControls" class="carousel slide" data-interval="false" data-ride="carousel">
              <div class="carousel-inner">
                <!-- eslint-disable -->
                <div class="carousel-item product-details-img active" v-for="(image, index) in product.productImages" v-if="index == 0" :key="image.id">
                  <img
                    :src="image.path"
                    class="d-block w-100"
                    alt="Product Image"
                    @mouseover="imgHover"
                    @mouseout="imgOut"
                  >
                </div>

                <div
                  class="carousel-item product-details-img"
                  v-for="(image, index) in product.productImages"
                  v-if="index != 0"
                  :key="image.id"
                >
                  <img
                    :src="image.path"
                    class="d-block w-100"
                    alt="Product Image"
                    @mouseover="imgHover"
                    @mouseout="imgOut"
                  >
                </div>
                <!-- eslint-enable -->
              </div>
              <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                <i class="fas fa-angle-left fa-2x mr-5"></i>
                <span class="sr-only">Previous</span>
              </a>
              <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                <i class="fas fa-angle-right fa-2x ml-5"></i>
              </a>
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
            <div class="product-details" ref="productDetails">
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
                  <p style="text-align: left">Brand<span style="float: right">{{ product.brand.name }}</span></p>
                </div>
                <hr>
                <div class="product-info-line">
                  <p style="text-align: left">Category<span style="float: right">{{ product.category.title }}</span></p>
                </div>
                <hr>
                <div class="product-info-line">
                  <p 
                    style="text-align: left"
                  >
                    Ratings
                    <span 
                      style="float: right" 
                      v-if="product.avgRating"
                    >
                      {{ Number(product.avgRating).toFixed(1) }}&nbsp;&#11088;
                    </span>
                    <span 
                      style="float: right" 
                      v-else
                    >
                      None
                    </span>
                  </p>
                </div>
              </div>
              <!-- product info div end -->
            </div>

            <div class="image-zoom-div" ref="imgZoom">
              <img :src="imgSrc" alt="zoomed image" id="zoomed-image" ref="zoomImg">
            </div>

            <!-- Product Review starts -->
            <div ref="productReviews">
              <div class="row mb-2">
                <div class="col-6">
                  <h4 class="mb-0">Product Reviews</h4>
                </div>
                <div class="col-6">
                  <button
                    class="btn btn-primary d-block ml-auto"
                    data-toggle="modal" 
                    data-target="#reviewModal"
                  >
                    Add Review
                  </button>
                </div>
                <div class="col-12">
                  <div class="alert alert-danger mt-2" role="alert" v-if="reviewError">
                    {{ reviewError }}
                  </div>
                </div>
              </div>
              <div class="product-reviews" v-if="product.reviews.length > 0">
                <div class="reviews mb-3">
                  <div class="review" v-for="(review, index) in visibleReviews" :key="index">
                    <p>
                      <span 
                        class="d-inline-flex align-items-center badge badge-success"
                      >
                        {{ review.rating }}&nbsp;&#11088;
                      </span>
                      &nbsp;&nbsp;&nbsp;{{ review.user.username }}
                    </p>
                    <p>{{ review.remark }}</p>
                  </div>
                </div>
                <Pagination 
                  :currentPage="currentPage" 
                  :totalPages="totalPages" 
                  :showPrevious="showPrevious()" 
                  :showNext="showNext()"
                  @pageClicked="filterReviews($event)"
                ></Pagination>
              </div>
              <div v-else>
                <p>No Reviews</p>
              </div>
            </div>
            <!-- Product Review ends -->
          </div>

          <!-- Product Review Modal starts -->
          <div class="modal fade" id="reviewModal" tabindex="-1" aria-labelledby="reviewModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="reviewModalLabel">Add Review</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <div class="modal-body">
                  <div class="form-group">
                    <label for="ratings">Ratings</label>
                    <select 
                      class="form-control" 
                      name="ratings" 
                      id="ratings"
                      @change="onSelect"
                    >
                      <option value="" selected hidden>Select Number of stars</option>
                      <option :value="i" v-for="i in 5" :key="i">{{ parseInt(i) }}</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="review">Review</label>
                    <textarea 
                      id="review" 
                      class="form-control" 
                      name="review" 
                      v-model="review" 
                      placeholder="Write review"
                    ></textarea>
                  </div>
                </div>
                
                <div class="modal-footer d-flex justify-content-center align-content-center">
                  <button 
                    type="button" 
                    class="btn btn-success" 
                    data-dismiss="modal"
                    @click.prevent="addReview()"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Product Review Modal ends -->
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
import Pagination from '../shared/pagination.vue';

export default {
  name: 'ProductDetailsUser',
  components: { Navbar, Pagination },
  data() {
    return {
      isAuthenticated: this.$store.getters.authStatus,
      isUserActive: this.$store.getters.userData.isActive,
      product: null,
      cartProducts: null,
      ratings: null,
      review: null,
      reviewError: null,
      isLoading: true,
      currentPage: null,
      totalPages: null,
      imgSrc: null,
      error: null,
      limit: 5,
      visibleReviews: []
    };
  },

  methods: {
    async getProduct() {
      try {
        const response = await axios.get(`${this.$store.getters.base_url}/shop/products/${this.$route.params.id}`);

        if(response.data.success) {
          this.product = response.data.payload;
          this.isLoading = false;
          this.totalPages = Math.ceil(this.product.reviews.length / this.limit);
          this.filterReviews(1);
        }
      } catch (error) {
        this.error = error.response.data.message;
      }
    },

    async getCart() {
      if(!this.isUserActive) {
        return;
      }
      try {
        const response = await this.$store.dispatch(`getCart`);
        
        if(response.data.success) {
          this.cartProducts = response.data.payload.products;
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.getCart();
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    },

    checkProductInCart(productId) {
      return this.cartProducts.some(product => product.id === productId);
    },

    async addToCart(productId) {
      if(!this.isAuthenticated) {
        return;
      }

      if(this.checkProductInCart(productId)) {
        alert('Product already in cart.');
        return;
      }
        
      try {
        const response = await this.$store.dispatch('addToCart', productId);
        if(response.data.success) {
          this.$router.push('/user/cart');
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.addToCart(productId);
        }
      } catch (error) {
        console.log(error.response);
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
        } else if(response.data.message !== 'Refreshed AccessToken') {
          alert(response.data.message);
        } else {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.addToWishList(productId);
        }
      } catch (error) {
        console.log(error.response);
      }
    },

    filterReviews(requiredPage) {
      const startIndex = (parseInt(requiredPage) - 1) * this.limit;
      const endIndex = startIndex + this.limit - 1;
      this.visibleReviews = this.product.reviews.filter((review, index) => index >= startIndex && index <= endIndex);
      this.currentPage = requiredPage;
    },

    showPrevious() {
      return this.currentPage == 1 ? false : true;
    },

    showNext() {
      return this.currentPage == this.totalPages ? false : true;
    },

    onSelect() {
      this.ratings = document.querySelector('#ratings').value;
    },

    async addReview() {
      try {
        const response = await axios.post(`${this.$store.getters.base_url}/user/review/${this.product.id}`, {
          review: this.review,
          ratings: this.ratings
        },
        {
          headers: {
            'Authorization': `Bearer ${this.$store.getters.refreshToken}`
          }, params: {
            accessToken: this.$store.getters.token
          }
        });

        if(response.data.success) {
          this.getProduct();
        } else if(response.data.message === 'Refreshed AccessToken') {
          this.$store.dispatch('refreshAccessToken', response.data.accessToken);
          await this.addReview();
        } else {
          this.reviewError = response.data.message;
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    },

    imgHover(event) {
      let imgZoomDiv = this.$refs.imgZoom;
      imgZoomDiv.style.display = 'block';
      let zoomImgEl = this.$refs.zoomImg;
      let ogImg = event.currentTarget;
      this.imgSrc = ogImg.src
      let prodDetailsEl = this.$refs.productDetails;
      let productReviewsEl = this.$refs.productReviews;
      prodDetailsEl.style.display = 'none';
      productReviewsEl.style.display = 'none';

      ogImg.addEventListener("mousemove",function(event){
        let clientX = event.clientX - ogImg.offsetLeft
        let clientY = event.clientY - ogImg.offsetTop
        
        var mWidth = ogImg.offsetWidth
        var mHeight = ogImg.offsetHeight
        clientX = clientX / mWidth * 100 
        clientY = clientY / mHeight * 100 - 40

        zoomImgEl.style.transform = 'translate(-'+clientX+'%, -'+clientY+'%) scale(2)'
      })
    },

    imgOut(event) {
      let imgZoomDiv = this.$refs.imgZoom;
      imgZoomDiv.style.display = 'none';
      this.imgSrc = null;
      let prodDetailsEl = this.$refs.productDetails;
      prodDetailsEl.style.display = 'block';
      let productReviewsEl = this.$refs.productReviews;
      productReviewsEl.style.display = 'block';
    }
  },

  created() {
    this.getProduct();
    this.getCart();
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
    cursor: crosshair;
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

  .review {
    padding: 15px 10px;
    border: 1px solid rgba(0,0,0,.1);
    border-radius: 3px;
  }

  .review p {
    margin-bottom: 0;
  }

  i {
    color: black !important;
  }

  .image-zoom-div {
	  overflow:hidden;
    max-width: 100%;
    max-height: 100%;
	  position: relative;
    height: 100% !important;
  }

  .image-zoom-div img {
    overflow: hidden;
    /* width: 100%;
    height: 100%; */
    object-fit: contain;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
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