// This is file with demos of your component
// Each export is one usecase for your component

import {
  AnimatedCard,
  CardBody,
  CardDescription,
  CardTitle,
  CardVisual,
} from "@/components/ui/animated-card-diagram"
import { Visual2 } from "@/components/ui/animated-card-diagram"
import DigitalSerenity from "@/components/ui/digital-serenity-animated-landing-page";

export default function AnimatedCard2Demo() {
  return (
    <AnimatedCard>
      <CardVisual>
        <Visual2 mainColor="#ff6900" secondaryColor="#f54900" />
      </CardVisual>
      <CardBody>
        <CardTitle>Just find the right caption</CardTitle>
        <CardDescription>
          This card will tell everything you want
        </CardDescription>
      </CardBody>
    </AnimatedCard>
  )
}

const DemoOne = () => {
  return <DigitalSerenity />;
};

export { DemoOne };