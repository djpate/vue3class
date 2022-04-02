import { defineComponent, type ComponentOptions } from "vue"

export default class VueBase {
  static buildSteps = ['LifecycleHooks', 'Methods', 'Data']
  static lifecycleHooks = [ 'created', 'mounted' ]

  _buildLifecycleHooks(): ComponentOptions {
    const opts = {}
    VueBase.lifecycleHooks.forEach(hook => {
      if (this[hook]) {
        opts[hook] = this[hook]
      }
    })
    return opts
  }

  get _descriptors() {
    return Object.entries(Object.getOwnPropertyDescriptors(this.constructor.prototype))
  }

  _buildMethods(): ComponentOptions {
    const opts = {
      methods: {}
    }
    this._descriptors.forEach(([key, descriptor]) => {
      if (key !== 'constructor' && descriptor.value && typeof descriptor.value === 'function') {
        opts.methods[key] = descriptor.value
      }
    })
    return opts
  }

  _buildData(): ComponentOptions {
    const opts = {}
    let data = {}
    Object.getOwnPropertyNames(this).map(variableName => {
      data[variableName] = this[variableName]
    })
    opts.data = () => data
    return opts
  }

  toComponent(extras: ComponentOptions = {}) {
    let opts: ComponentOptions = extras
    for(let step of VueBase.buildSteps) {
      console.log('Building step:', step)
      opts = { ...opts, ...this['_build' + step]() }
    }
    return defineComponent(opts)
  }
}