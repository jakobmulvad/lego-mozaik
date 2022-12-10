import { FC, useMemo } from 'react';
import {
  Divider,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Stack,
  Text,
} from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import { LegoColor } from '../utils/lego-colors';
import { generateShoppingList } from '../utils/dots';

export type ShoppingListModalProps = { legoColors: LegoColor[] } & Omit<ModalProps, 'children'>;

export const ShoppingListModal: FC<ShoppingListModalProps> = ({ legoColors, isOpen, ...modalProps }) => {
  const shoppingList = useMemo(() => {
    if (!isOpen) {
      return undefined;
    }

    return generateShoppingList(legoColors);
  }, [legoColors, isOpen]);

  console.log(shoppingList);

  // Calculate shopping list
  /*useEffect(() => {
    const shoppingList: Record<number, number> = {};

    const addToShoppingList = (element: number) => {
      shoppingList[element] = (shoppingList[element] ?? 0) + 1;
    };

    // Count elements in layers
    for (const layer of layers) {
      switch (layer.type) {
        case 'DOT':
          layer.dots.map((d) => d.element).forEach(addToShoppingList);
          break;

        case 'PLATE':
          layer.placements.map((p) => p.brick.element).forEach(addToShoppingList);
          break;
      }
    }

    // Subtract elements from world map set
    for (const element of Object.keys(dotsInWorldmap)) {
      if (element in shoppingList) {
        const elementNo: number = element as unknown as number;
        const newCount = Math.max(0, shoppingList[elementNo] - dotsInWorldmap[elementNo]);
        if (newCount == 0) {
          delete shoppingList[elementNo];
        } else {
          shoppingList[elementNo] = newCount;
        }
      }
    }

    console.log(shoppingList);

    /*const totalPrice = Object.keys(elementDistribution).reduce<number>((acc, elementUn) => {
      const element = elementUn as unknown as number;
      const dotsFromWorldmap = dotsInWorldmap[element] ?? 0;
      const dotsNeeded = Math.max(0, elementDistribution[element] - dotsFromWorldmap);
      return acc + 0.26 * dotsNeeded;
    }, 0);
  }, [layers]);*/

  const count = useMemo(() => {
    if (!shoppingList) {
      return 0;
    }

    return Object.entries(shoppingList).reduce((sum, [, count]) => {
      return sum + count;
    }, 0);
  }, [shoppingList]);

  return (
    <Modal size="2xl" closeOnOverlayClick={false} isOpen={isOpen} {...modalProps}>
      <ModalContent>
        <ModalHeader>Your shopping list</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid gridTemplateColumns="1fr 1fr" alignItems="center">
            {shoppingList &&
              Object.entries(shoppingList).map(([element, count]) => {
                return (
                  <GridItem>
                    <Stack direction="row" alignItems="center">
                      <Text width="4rem" textAlign="right">
                        {count} x
                      </Text>
                      <img
                        width="64"
                        height="64"
                        src={`https://www.lego.com/cdn/product-assets/element.img.lod5photo.192x192/${element}.jpg`}
                      />
                      <Text fontSize="smaller">{element}</Text>
                    </Stack>
                  </GridItem>
                );
              })}
          </Grid>
          <Divider my={8} />
          <Text>{count} dots used in total</Text>
          <Text>Estimated cost: USD ${(0.03 * count).toFixed(2)}</Text>
        </ModalBody>
        <ModalFooter color="red.500" justifyContent="center">
          {count !== legoColors?.length && (
            <>
              <WarningTwoIcon mr={2} />
              One or more dots are missing!! Could be a color that could not be found
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
