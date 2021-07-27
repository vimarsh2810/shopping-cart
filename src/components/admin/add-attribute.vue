<template>
  <div class="main-div">
    <AdminNavbar/>
    <div class="container">
      <div class="card card-1">
        <h5 class="card-title">Add Attribute</h5>
        <!-- Form starts -->
        <form @submit.prevent="addAttribute" method="POST">
          <div class="alert alert-danger" role="alert" v-if="errors">
            {{ errors }}
          </div>

          <div class="alert alert-success" role="alert" v-if="successMsg">
            {{ successMsg }}
          </div>

          <div class="form-group">
            <label for="title">Attribute Title</label>
            <input 
              type="text" 
              name="title" 
              id="title" 
              class="form-control" 
              v-model="attributeTitle" 
              placeholder="Enter attribute title"
            >
          </div>
          
          <p class="mb-0">Is Attribute Color?</p>
          <!-- eslint-disable -->
          <div
            class="chip-div d-inline"
            v-for="(attributeValue, index) in attributeValues"
            :key="attributeValue.value"
            v-if="attributeValues.length > 0"
          >
            <div class="chip mb-1 mr-1" v-if="attributeValue.value">
              <p v-if="isColor">
                {{ attributeValue.value }}: {{ attributeValue.hex }}
                <span class="closebtn" @click="removeAttributeValue(index)">&times;</span>
              </p>
              <p v-if="!isColor">
                {{ attributeValue.value }}
                <span class="closebtn" @click="removeAttributeValue(index)">&times;</span>
              </p>
            </div>
          </div>
          
          <!-- eslint-enable -->
          <div class="color-checkbox d-block">
            <div class="form-check form-check-inline">
              <input
                type="radio"
                name="isColor"
                class="form-check-input"
                id="color"
                :value="true"
                v-model="isColor"
                @change="onSelectCheckbox"
              >
              <label class="form-check-label" for="color">
                True
              </label>
            </div>

            <div class="form-check form-check-inline mb-3">
              <input
                type="radio"
                name="isColor"
                class="form-check-input"
                id="notColor"
                :value="false"
                v-model="isColor"
                @change="onSelectCheckbox"
              >
              <label class="form-check-label" for="notColor">
                False
              </label>
            </div>
          </div>

          <div class="form-group" v-if="checkBoxSelected">
            <label for="attrValue">Attribute Values</label>
            <input
              type="text"
              class="form-control mb-2"
              name="attrValue"
              id="attrValue"
              v-model="attributeValues[currentIndex].value"
              placeholder="Enter value of attribute"
            >          
            <input
              type="text"
              class="form-control mb-2"
              name="attrHex"
              id="attrHex"
              v-if="isColor"
              v-model="attributeValues[currentIndex].hex"
              placeholder="Enter hex code of color"
            >
            <button class="btn btn-primary material-button" @click.prevent="addAttrValue">Add</button>         
          </div>

          <button class="btn btn-primary material-button d-block" type="submit">Add Attribute</button>
        </form>
        <!-- Form ends -->
      </div>
    </div>   
  </div>
</template>

<script>
import axios from 'axios';

import AdminNavbar from '../shared/admin-navbar.vue';

export default {
  name: 'AddAttribute',
  components: { AdminNavbar },
  data() {
    return {
      isAuthenticated: this.$store.getters.authStatus,
      isUserActive: this.$store.getters.userData.isActive,
      attributeTitle: null,
      isColor: null,
      checkBoxSelected: false,
      attributeValues: [],
      currentIndex: null,
      errors: null,
      successMsg: null
    }
  },

  methods: {

    onSelectCheckbox() {
      if(this.isColor) {
        this.attributeValues.push({ value: null, hex: null });
      } else {
        this.attributeValues.push({ value: null });
      }
      this.checkBoxSelected = true;
    },

    removeAttributeValue(index) {
      
      this.attributeValues.splice(index, 1);
      this.currentIndex = this.attributeValues.length - 1;
    },
    
    addAttrValue() {
      this.attributeValues.push({ value: '', hex: '' });
      this.currentIndex = this.attributeValues.length - 1;
    },

    async addAttribute() {
      if(this.attributeValues.length <= 0) {
        return;
      }

      try {
        const response = await axios.post(`${this.$store.getters.base_url}/admin/attribute`, {
          title: this.attributeTitle,
          attributeValues: this.attributeValues
        });

        if(response.data.success) {
          this.errors = null;
          this.successMsg = response.data.message;
        }
      } catch (error) {
        this.errors = error.response.data.message;
      }
    }
  },
  created() {
    this.currentIndex = this.attributeValues.length;
  }
}
</script>

<style scoped src="../../assets/css/form.css"></style>

<style scoped>
  .card-1 {
    margin-top: 100px !important;
  }

  .closebtn {
    padding-left: 5px;
    color: #888;
    font-weight: bold;
    float: right;
    font-size: 15px;
    cursor: pointer;
  }

  .closebtn:hover {
    color: #000;
  }

  .chip {
    display: inline-block;
    padding: 0 15px;
    height: 30px;
    font-size: 10px;
    line-height: 30px;
    border-radius: 15px;
    background-color: #f1f1f1;
  }

</style>