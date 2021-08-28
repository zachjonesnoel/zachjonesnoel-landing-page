import React from "react";

const Tweets = () => {
    return (
        <div className="mt-12 lg:mt-18 sm:py-12 py-6">
            <div className="max-w-4xl px-4 mx-auto text-gray-800 dark:text-white ">
                <div className="pb-8 mb-2 border-t-2 border-gray-300 dark:border-white-300"></div>
                <div className="flex flex-col justify-between lg:flex-row items-center">
                    <form action="#" method="POST">
                        <div class="shadow overflow-hidden lg:rounded-md dark:bg-black dark:text-white">
                          <div class="px-4 py-5 bg-white sm:p-6 dark:bg-black dark:text-white">
                            <div class="grid grid-cols-12 gap-6 dark:bg-black dark:text-white">
                              <div class="col-span-6 sm:col-span-3">
                                <label for="first-name" class="block text-sm font-medium text-gray-700  dark:text-white">First name</label>
                                <input type="text" name="first-name" id="first-name" autocomplete="given-name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                              </div>
                
                              <div class="col-span-6 sm:col-span-3">
                                <label for="last-name" class="block text-sm font-medium text-gray-700  dark:text-white">Last name</label>
                                <input type="text" name="last-name" id="last-name" autocomplete="family-name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                              </div>
                
                              <div class="col-span-6 sm:col-span-4">
                                <label for="email-address" class="block text-sm font-medium text-gray-700  dark:text-white">Email address</label>
                                <input type="text" name="email-address" id="email-address" autocomplete="email" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                              </div>
                
                              <div class="col-span-6 sm:col-span-3">
                                <label for="country" class="block text-sm font-medium text-gray-700  dark:text-white">Country / Region</label>
                                <input type="text" name="street-address" id="country" autocomplete="street-address" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                              </div>
                
                              <div class="col-span-6">
                                <label for="street-address" class="block text-sm font-medium text-gray-700  dark:text-white">Street address</label>
                                <input type="text" name="street-address" id="street-address" autocomplete="street-address" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
                              </div>
                
                              
                            </div>
                          </div>
                          <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 dark:bg-black dark:text-white">
                            <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              Save
                            </button>
                          </div>
                        </div>
                      </form>
                </div>
            </div>
        </div>
    )
}

export default Tweets;