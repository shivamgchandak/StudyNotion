import { courseCategories } from "@/config";
import banner from "../../../../public/banner-img.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  console.log(auth);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-col items-center justify-between px-4 py-8 lg:flex-row lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="mb-4 text-4xl font-bold">Learning thet gets you</h1>
          <p className="text-xl">
            Skills for your present and your future. Get Started with US
          </p>
        </div>
        <div className="mb-8 lg:w-full lg:mb-0">
          <img
            src={banner}
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </section>
      <section className="px-4 py-8 bg-gray-100 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold">Course Categories</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start"
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="px-4 py-12 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold">Recommended Courses</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) =>
              auth.user.recommendations.map((id, key) => {
                if (courseItem.category == id) {
                  return (
                    <div
                      onClick={() => handleCourseNavigate(courseItem?._id)}
                      className="overflow-hidden border rounded-lg shadow cursor-pointer"
                    >
                      <img
                        src={courseItem?.image}
                        width={300}
                        height={150}
                        className="object-cover w-full h-40"
                      />
                      <div className="p-4">
                        <h3 className="mb-2 font-bold">{courseItem?.title}</h3>
                        <p className="mb-2 text-sm text-gray-700">
                          {courseItem?.instructorName}
                        </p>
                        <p className="font-bold text-[16px]">
                          ${courseItem?.pricing}
                        </p>
                      </div>
                    </div>
                  );
                }
              })
            )
          ) : (
            <h1>No Courses Found</h1>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
