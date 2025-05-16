import { Link, useParams } from "react-router-dom";
import { timeAgo } from "../Services/Utilities";
const PostedJobsCards = (props: any) => {
  const { id } = useParams();
 const jobId = String(props.id);
  const isActive = jobId === id;
  console.log(jobId);
  return (
    <Link
      to={`/posted-job/${props.id}`}
      className={`
        ${isActive ? "bg-bright-sun-400 text-mine-shaft-400 border-white" : "bg-mine-shaft-900 text-white"}
        p-3 sm:p-3 
        border-l-4 sm:border-l-8 
        border-bright-sun-400 
        shadow-sm
        hover:shadow-md
        transition-all 
        duration-200 
        block
        w-[60%]
      `}
    >
      <div className="text-sm sm:text-base font-semibold truncate">{props.jobTitle}</div>
      <div className="text-xs sm:text-sm font-medium text-mine-shaft-400">
        {props.location || "Select Location"}
      </div>
      <div className="md:text-xs sm:text-sm mt-1 fw-semibold text-mine-shaft-400">
        {props.jobStatus === "DRAFT"
          ? "Drafted"
          : props.jobStatus === "CLOSED"
          ? "Closed"
          : "Posted"}{" "}
        • {timeAgo(props.postTime)}
      </div>
    </Link>
  );
};
export default PostedJobsCards;
