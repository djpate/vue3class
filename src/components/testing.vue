<script lang="ts">
import VueBase from "./vueBase";

function Component(extraOptions: ComponentOptions) {
  return function (target: typeof VueBase) {
    return new target().toComponent(extraOptions)
  }
}

function Watch(methodToWatch){
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let classProto = Object.getPrototypeOf(target)
    classProto._watchers ||= {}
    classProto._watchers[methodToWatch] ||= []
    classProto._watchers[methodToWatch].push(descriptor.value)
    return descriptor.value
  };
}

@Component({})
export default class Testing extends VueBase {

  firstName: string = 'Johnny';
  count = 0
  price = 15

  created() {
    console.log('mounted');
  }

  get totalPrice() {
    return this.count * this.price
  }

  @Watch('count')
  onCountChange(newValue: number, oldValue: number) {
    console.log(`count changed from ${oldValue} to ${newValue}`);
  }

  mounted() {
    console.log('mounted');
  }

  increment() {
    this.count++;
  }
}
</script>

<template>
  <div class="testing">
    <span>{{ firstName }} :  {{ count }}</span>
    <button @click="increment">Increment</button>
    <span> Total Price : ${{ totalPrice }}</span>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}
</style>
