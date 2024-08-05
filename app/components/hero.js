import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Card,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ScrollShadow,
} from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";

const fetchMeals = async (category) => {
  const cachedMeals = localStorage.getItem(`meals-${category}`);
  if (cachedMeals) {
    return JSON.parse(cachedMeals);
  }

  const url =
    category === "all"
      ? "https://www.themealdb.com/api/json/v1/1/search.php?s="
      : `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
  const response = await axios.get(url);
  const meals = response.data.meals;

  localStorage.setItem(`meals-${category}`, JSON.stringify(meals));
  return meals;
};

const fetchMealDetails = async (id) => {
  const cachedMealDetails = localStorage.getItem(`meal-details-${id}`);
  if (cachedMealDetails) {
    return JSON.parse(cachedMealDetails);
  }

  const response = await axios.get(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const mealDetails = response.data.meals[0];

  localStorage.setItem(`meal-details-${id}`, JSON.stringify(mealDetails));
  return mealDetails;
};

const Hero = () => {
  const [meals, setMeals] = useState([]);
  const [category, setCategory] = useState("all");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const loadMeals = async () => {
      const fetchedMeals = await fetchMeals(category);
      const detailedMeals = await Promise.all(
        fetchedMeals.map(async (meal) => {
          const details = await fetchMealDetails(meal.idMeal);
          return { ...meal, ...details };
        })
      );
      setMeals(detailedMeals);
    };
    loadMeals();
  }, [category]);

  const handleTabChange = (key) => {
    setCategory(key);
  };

  const openModal = (meal) => {
    setSelectedMeal(meal);
    onOpen();
  };

  return (
    <ScrollShadow className="min-h-screen bg-background mt-6 mb-6 rounded-lg shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 border-b-2 pb-4 border-pastel2">
          <h1 className="text-2xl font-bold text-primary">Recipes</h1>
          <Tabs
            aria-label="Food Categories"
            color="tabs-color"
            radius="full"
            onSelectionChange={handleTabChange}
          >
            <Tab key="all" title="All" />
            <Tab key="Seafood" title="Seafood" />
            <Tab key="Dessert" title="Dessert" />
          </Tabs>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {meals.map((meal, index) => (
            <Card
              key={index}
              className="w-full h-72 space-y-5 p-4 flex flex-col justify-between bg-pastel8"
              radius="lg"
            >
              <div className="h-32 w-full relative rounded-lg overflow-hidden">
                <Image
                  src={`${meal.strMealThumb}/preview`}
                  alt={meal.strMeal}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="space-y-3 flex-grow flex flex-col justify-between">
                <h2 className="text-lg font-bold text-center text-primary">
                  {meal.strMeal}
                </h2>
                <Button
                  color="primary"
                  onPress={() => openModal(meal)}
                  className="w-full text-white hover:bg-secondary"
                >
                  Ingredients
                </Button>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="bg-pastel3 text-primary px-2 py-1 rounded-full text-xs">
                    {meal.strCategory}
                  </span>
                  <span className="bg-pastel4 text-primary px-2 py-1 rounded-full text-xs">
                    {meal.strArea}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          className="w-[80%] h-[80%]"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-primary">
                  {selectedMeal?.strMeal}
                </ModalHeader>
                <ScrollShadow className="max-h-[60vh]">
                  <ModalBody className="space-y-4">
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-primary">
                          Ingredients:
                        </h3>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedMeal &&
                            Array.from(
                              { length: 20 },
                              (_, i) =>
                                selectedMeal[`strIngredient${i + 1}`] &&
                                selectedMeal[`strMeasure${i + 1}`]
                            ).map(
                              (ingredient, i) =>
                                ingredient && (
                                  <li key={i}>{`${
                                    selectedMeal[`strMeasure${i + 1}`]
                                  } ${
                                    selectedMeal[`strIngredient${i + 1}`]
                                  }`}</li>
                                )
                            )}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary">
                          Instructions:
                        </h3>
                        <p className="whitespace-pre-wrap">
                          {selectedMeal?.strInstructions}
                        </p>
                      </div>
                    </div>
                  </ModalBody>
                </ScrollShadow>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </ScrollShadow>
  );
};

export default Hero;
