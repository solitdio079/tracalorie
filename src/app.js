import '@fortawesome/fontawesome-free/js/all'
import { Modal, Collapse } from 'bootstrap'
import CalorieTracker from './Tracker'
import {Meal, Workout} from "./Item"
import './css/bootstrap.css'
import './css/style.css'


class App {
  constructor() {
    this._tracker = new CalorieTracker()
    this._loadEventListeners()
    this._tracker.loadItems()
  }
  _loadEventListeners() {class Storage {
    static getCalorieLimit(defaultLimit = 2000) {
      let calorieLimit
      if (localStorage.getItem('calorieLimit') === null) {
        calorieLimit = defaultLimit
      } else {
        calorieLimit = localStorage.getItem('calorieLimit')
      }

      return calorieLimit
    }

    static setCalorieLimit(calorieLimit) {
      localStorage.setItem('calorieLimit', calorieLimit)
    }

    static getTotalCalories(defaultCalories = 0) {
      let totalCalories
      if (localStorage.getItem('totalCalories') === null) {
        totalCalories = defaultCalories
      } else {
        totalCalories = +localStorage.getItem('totalCalories')
      }

      return totalCalories
    }

    static updateTotalCalories(calories) {
      localStorage.setItem('totalCalories', calories)
    }

    static getMeals() {
      let meals
      if (localStorage.getItem('meals') === null) {
        meals = []
      } else {
        meals = JSON.parse(localStorage.getItem('meals'))
      }

      return meals
    }

    static saveMeal(meal) {
      const meals = Storage.getMeals()
      meals.push(meal)
      localStorage.setItem('meals', JSON.stringify(meals))
    }

    static removeMeal(id) {
      const meals = Storage.getMeals()
      meals.forEach((meal, index) => {
        if (meal.id === id) {
          meals.splice(index, 1)
        }
      })

      localStorage.setItem('meals', JSON.stringify(meals))
    }

    static getWorkouts() {
      let workouts
      if (localStorage.getItem('workouts') === null) {
        workouts = []
      } else {
        workouts = JSON.parse(localStorage.getItem('workouts'))
      }

      return workouts
    }

    static saveWorkout(workout) {
      const workouts = Storage.getWorkouts()
      workouts.push(workout)
      localStorage.setItem('workouts', JSON.stringify(workouts))
    }

    static removeWorkout(id) {
      const workouts = Storage.getWorkouts()
      workouts.forEach((workout, index) => {
        if (workout.id === id) {
          workouts.splice(index, 1)
        }
      })

      localStorage.setItem('workouts', JSON.stringify(workouts))
    }

    static clearAll() {
      localStorage.removeItem('totalCalories')
      localStorage.removeItem('meals')
      localStorage.removeItem('workouts')
      // localStorage.clear()
    }
  }

    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newItem.bind(this, 'meal'))
    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newItem.bind(this, 'workout'))

    document
      .getElementById('meal-items')
      .addEventListener('click', this._removeItem.bind(this, 'meal'))
    document
      .getElementById('workout-items')
      .addEventListener('click', this._removeItem.bind(this, 'workout'))

    document
      .getElementById('filter-meals')
      .addEventListener('keyup', this._filterItems.bind(this, 'meal'))
    document
      .getElementById('filter-workouts')
      .addEventListener('keyup', this._filterItems.bind(this, 'workout'))

    document
      .getElementById('reset')
      .addEventListener('click', this._reset.bind(this))

    document
      .getElementById('limit-form')
      .addEventListener('submit', this._setLimit.bind(this))
  }
  _newItem(type, e) {
    e.preventDefault()

    const name = document.getElementById(`${type}-name`)
    const calories = document.getElementById(`${type}-calories`)

    // Validate Input
    if (name.value === '' || calories.value === '') {
      alert('Please fill in all fields')
      return
    } else {
      if (type === 'meal') {
        const meal = new Meal(name.value, +calories.value)
        this._tracker.addMeal(meal)
      } else {
        const workout = new Workout(name.value, +calories.value)
        this._tracker.addWorkout(workout)
      }

      name.value = ''
      calories.value = ''

      const collapseItem = document.getElementById(`collapse-${type}`)
      const bsCollapse = new Collapse(collapseItem, { toggle: true })
    }
  }
  _removeItem(type, e) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      if (confirm('Are you sure?')) {
        const id = e.target.closest('.card').getAttribute('data-id')

        type === 'meal'
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id)

        e.target.closest('.card').remove()
      }
    }
  }
  _filterItems(type, e) {
    const text = e.target.value.toLowerCase()
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent
      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = 'block'
      } else {
        item.style.display = 'none'
      }
    })
  }

  _reset() {
    this._tracker.reset()
    document.getElementById('meal-items').innerHTML = ''
    document.getElementById('workout-items').innerHTML = ''
    document.getElementById('filter-meals').value = ''
    document.getElementById('filter-workouts').value = ''
  }

  _setLimit(e) {
    e.preventDefault()
    const limit = document.getElementById('limit')

    if (limit.value === '') {
      alert('Please add a limit')
      return
    }

    this._tracker.setLimit(+limit.value)
    limit.value = ''
    const modalEl = document.getElementById('limit-modal')
    const modal = Modal.getInstance(modalEl)
    modal.hide()
  }
}

const app = new App()

 