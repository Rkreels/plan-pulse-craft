
import { PageTitle } from "@/components/common/PageTitle";
import { RequirementsList } from "@/components/requirements/RequirementsList";

const Requirements = () => {
  return (
    <>
      <PageTitle
        title="Requirements Management"
        description="Define and manage detailed product requirements"
      />
      
      <RequirementsList />
    </>
  );
};

export default Requirements;
