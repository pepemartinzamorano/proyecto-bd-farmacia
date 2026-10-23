-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema farmacia
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema farmacia
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `farmacia` DEFAULT CHARACTER SET utf8 ;
USE `farmacia` ;

-- -----------------------------------------------------
-- Table `farmacia`.`ALMACEN`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`ALMACEN` (
  `nif` VARCHAR(9) NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `direccion` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(15) NOT NULL,
  `activo` BOOLEAN DEFAULT TRUE, -- Actualización Segundo Cuatrimestre
  PRIMARY KEY (`nif`),
  UNIQUE INDEX `nif_UNIQUE` (`nif` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`TITULACION`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`TITULACION` (
  `nombre` VARCHAR(45) NOT NULL,
  `institucion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`nombre`, `institucion`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`FAMILIA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`FAMILIA` (
  `nombre` VARCHAR(20) NOT NULL,
  `descripcion` MEDIUMTEXT NULL,
  PRIMARY KEY (`nombre`),
  UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`PRINCIPIO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`PRINCIPIO` (
  `id` VARCHAR(20) NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  UNIQUE INDEX `nombre_UNIQUE` (`nombre` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`CATEGORIA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`CATEGORIA` (
  `nombre` VARCHAR(45) NOT NULL,
  `nombre_padre` VARCHAR(45) NULL,
  PRIMARY KEY (`nombre`),
  INDEX `nombre_padre_idx` (`nombre_padre` ASC) ,
  CONSTRAINT `fk_categoria_subcategoria`
    FOREIGN KEY (`nombre_padre`)
    REFERENCES `farmacia`.`CATEGORIA` (`nombre`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`MEDICO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`MEDICO` (
  `num_colegiado` VARCHAR(15) NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `apellidos` VARCHAR(45) NOT NULL,
  `hospital` VARCHAR(45) NOT NULL,
  `especialidad` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`num_colegiado`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`LABORATORIO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`LABORATORIO` (
  `nombre` VARCHAR(30) NOT NULL,
  `pais` VARCHAR(15) NOT NULL,
  `telefono` VARCHAR(15) NOT NULL,
  `imagen` VARCHAR(255) NOT NULL, -- Actualización Segundo Cuatrimestre
  `url` VARCHAR(500) NOT NULL, -- Actualización Segundo Cuatrimestre
  PRIMARY KEY (`nombre`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`PRODUCTO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`PRODUCTO` (
  `codigo` VARCHAR(20) NOT NULL,
  `nombre` VARCHAR(30) NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`codigo`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`PARAFARMACIA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`PARAFARMACIA` (
  `codigo_producto` VARCHAR(20) NOT NULL,
  `marca` VARCHAR(20) NOT NULL,
  `formato` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`codigo_producto`),
  CONSTRAINT `fk_parafarmacia_producto`
    FOREIGN KEY (`codigo_producto`)
    REFERENCES `farmacia`.`PRODUCTO` (`codigo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`MEDICAMENTO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`MEDICAMENTO` (
  `codigo_medicamento` VARCHAR(20) NOT NULL,
  `cantidad` INT NOT NULL,
  `forma` VARCHAR(45) NOT NULL,
  `nombre_laboratorio` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`codigo_medicamento`),
  INDEX `nombre_laboratorio_idx` (`nombre_laboratorio` ASC) ,
  CONSTRAINT `fk_medicamento_producto`
    FOREIGN KEY (`codigo_medicamento`)
    REFERENCES `farmacia`.`PRODUCTO` (`codigo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_medicamento_laboratorio`
    FOREIGN KEY (`nombre_laboratorio`)
    REFERENCES `farmacia`.`LABORATORIO` (`nombre`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`TRABAJADOR`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`TRABAJADOR` (
  `num_ss` VARCHAR(15) NOT NULL,
  `nombre` VARCHAR(45) NOT NULL,
  `apellidos` VARCHAR(45) NOT NULL,
  `telefono` VARCHAR(15) NOT NULL,
  `fecha_incorporacion` DATE NOT NULL,
  `fecha_desvinculacion` DATE NULL,
  `sueldo` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`num_ss`),
  UNIQUE INDEX `num_ss_UNIQUE` (`num_ss` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`RECETA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`RECETA` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha_emision` DATE NOT NULL,
  `num_colegiado_medico` VARCHAR(15) NOT NULL,
  `fecha_caducidad` DATE NOT NULL,
  INDEX `num_colegiado_medico_idx` (`num_colegiado_medico` ASC) ,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_receta_medico`
    FOREIGN KEY (`num_colegiado_medico`)
    REFERENCES `farmacia`.`MEDICO` (`num_colegiado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`PEDIDO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`PEDIDO` (
  `num_albaran` VARCHAR(20) NOT NULL,
  `nif_almacen` VARCHAR(9) NOT NULL,
  `num_ss_trabajador` VARCHAR(15) NOT NULL,
  `fecha_emision` DATE NOT NULL,
  PRIMARY KEY (`num_albaran`, `nif_almacen`),
  INDEX `nif_almacen_idx` (`nif_almacen` ASC) ,
  INDEX `num_ss_trabajador_idx` (`num_ss_trabajador` ASC) ,
  CONSTRAINT `fk_pedido_almacen`
    FOREIGN KEY (`nif_almacen`)
    REFERENCES `farmacia`.`ALMACEN` (`nif`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedido_trabajador`
    FOREIGN KEY (`num_ss_trabajador`)
    REFERENCES `farmacia`.`TRABAJADOR` (`num_ss`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`COMPRA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`COMPRA` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `num_ss_vendedor` VARCHAR(15) NOT NULL,
  `fecha` DATETIME NOT NULL,
  `id_receta` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `num_ss_vendedor` (`num_ss_vendedor` ASC) ,
  INDEX `fk_compra_receta_idx` (`id_receta` ASC) ,
  CONSTRAINT `fk_compra_trabajador`
    FOREIGN KEY (`num_ss_vendedor`)
    REFERENCES `farmacia`.`TRABAJADOR` (`num_ss`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_compra_receta`
    FOREIGN KEY (`id_receta`)
    REFERENCES `farmacia`.`RECETA` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`LOTE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`LOTE` (
  `codigo_producto` VARCHAR(20) NOT NULL,
  `num_lote` VARCHAR(20) NOT NULL,
  `fecha_produccion` DATE NOT NULL,
  `fecha_caducidad` DATE NOT NULL,
  PRIMARY KEY (`codigo_producto`, `num_lote`),
  CONSTRAINT `fk_lote_producto`
    FOREIGN KEY (`codigo_producto`)
    REFERENCES `farmacia`.`PRODUCTO` (`codigo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`CONTIENE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`CONTIENE` (
  `num_albaran` VARCHAR(20) NOT NULL,
  `nif_almacen` VARCHAR(9) NOT NULL,
  `codigo_producto` VARCHAR(20) NOT NULL,
  `num_lote` VARCHAR(20) NOT NULL,
  `cantidad` INT NOT NULL,
  `coste_unitario` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`num_albaran`, `nif_almacen`, `codigo_producto`, `num_lote`),
  INDEX `fk_contiene_lote_idx` (`codigo_producto` ASC, `num_lote` ASC) ,
  CONSTRAINT `fk_contiene_pedido`
    FOREIGN KEY (`num_albaran` , `nif_almacen`)
    REFERENCES `farmacia`.`PEDIDO` (`num_albaran` , `nif_almacen`)
    ON DELETE CASCADE -- Actualización Segundo Cuatrimestre
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_contiene_lote`
    FOREIGN KEY (`codigo_producto` , `num_lote`)
    REFERENCES `farmacia`.`LOTE` (`codigo_producto` , `num_lote`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`INCLUYE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`INCLUYE` (
  `id_compra` INT NOT NULL,
  `codigo_producto` VARCHAR(20) NOT NULL,
  `num_lote` VARCHAR(20) NOT NULL,
  `cantidad` INT NOT NULL,
  `precio_venta` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id_compra`, `codigo_producto`, `num_lote`),
  INDEX `fk_incluye_lote_idx` (`codigo_producto` ASC, `num_lote` ASC) ,
  CONSTRAINT `fk_incluye_compra`
    FOREIGN KEY (`id_compra`)
    REFERENCES `farmacia`.`COMPRA` (`id`)
    ON DELETE CASCADE -- Modificación Segundo Cuatrimestre
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_incluye_lote`
    FOREIGN KEY (`codigo_producto` , `num_lote`)
    REFERENCES `farmacia`.`LOTE` (`codigo_producto` , `num_lote`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`BASADO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`BASADO` (
  `codigo_medicamento` VARCHAR(20) NOT NULL,
  `id_principio` VARCHAR(20) NOT NULL,
  `dosis` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`codigo_medicamento`, `id_principio`),
  INDEX `id_principio_idx` (`id_principio` ASC) ,
  CONSTRAINT `fk_basado_medicamento`
    FOREIGN KEY (`codigo_medicamento`)
    REFERENCES `farmacia`.`MEDICAMENTO` (`codigo_medicamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_basado_principio`
    FOREIGN KEY (`id_principio`)
    REFERENCES `farmacia`.`PRINCIPIO` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`INCOMPATIBLE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`INCOMPATIBLE` (
  `id_principio` VARCHAR(20) NOT NULL,
  `id_principio_contraindicado` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id_principio`, `id_principio_contraindicado`),
  INDEX `id_principio_contraindicado_idx` (`id_principio_contraindicado` ASC) ,
  CONSTRAINT `fk_incompatible_principio`
    FOREIGN KEY (`id_principio`)
    REFERENCES `farmacia`.`PRINCIPIO` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_incompatible_principio_contraindicado`
    FOREIGN KEY (`id_principio_contraindicado`)
    REFERENCES `farmacia`.`PRINCIPIO` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`PERTENECE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`PERTENECE` (
  `codigo_producto` VARCHAR(20) NOT NULL,
  `nombre_categoria` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`codigo_producto`, `nombre_categoria`),
  INDEX `nombre_categoria_idx` (`nombre_categoria` ASC) ,
  CONSTRAINT `fk_pertenece_producto`
    FOREIGN KEY (`codigo_producto`)
    REFERENCES `farmacia`.`PARAFARMACIA` (`codigo_producto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pertenece_categoria`
    FOREIGN KEY (`nombre_categoria`)
    REFERENCES `farmacia`.`CATEGORIA` (`nombre`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`APARECE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`APARECE` (
  `codigo_medicamento` VARCHAR(20) NOT NULL,
  `id_receta` INT NOT NULL,
  `instrucciones` MEDIUMTEXT NULL,
  PRIMARY KEY (`codigo_medicamento`, `id_receta`),
  INDEX `fk_aparece_receta_idx` (`id_receta` ASC) ,
  CONSTRAINT `fk_aparece_medicamento`
    FOREIGN KEY (`codigo_medicamento`)
    REFERENCES `farmacia`.`MEDICAMENTO` (`codigo_medicamento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_aparece_receta`
    FOREIGN KEY (`id_receta`)
    REFERENCES `farmacia`.`RECETA` (`id`)
    ON DELETE CASCADE -- Actualización Segundo Cuatrimestre
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`OBTUVO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`OBTUVO` (
  `num_ss_trabajador` VARCHAR(15) NOT NULL,
  `nombre_titulacion` VARCHAR(45) NOT NULL,
  `institucion` VARCHAR(45) NOT NULL,
  `fecha_obtencion` DATE NOT NULL,
  PRIMARY KEY (`num_ss_trabajador`, `nombre_titulacion`, `institucion`),
  INDEX `nombre_titulacion,institucion_idx` (`nombre_titulacion` ASC, `institucion` ASC) ,
  CONSTRAINT `fk_obtuvo_trabajador`
    FOREIGN KEY (`num_ss_trabajador`)
    REFERENCES `farmacia`.`TRABAJADOR` (`num_ss`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_obtuvo_titulacion`
    FOREIGN KEY (`nombre_titulacion` , `institucion`)
    REFERENCES `farmacia`.`TITULACION` (`nombre` , `institucion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `farmacia`.`CLASIFICADO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `farmacia`.`CLASIFICADO` (
`id_principio` VARCHAR(20) NOT NULL,
`nombre_familia` VARCHAR(20) NOT NULL,
PRIMARY KEY (`id_principio`,`nombre_familia`),
INDEX `fk_clasificado_familia_idx` (`nombre_familia` ASC) , 
CONSTRAINT `fk_clasificado_principio`
	FOREIGN KEY (`id_principio`)
	REFERENCES `farmacia`.`PRINCIPIO`(`id`)
	ON DELETE NO ACTION
    ON UPDATE NO ACTION,
CONSTRAINT `fk_clasificado_familia`
	FOREIGN KEY (`nombre_familia`)
	REFERENCES `farmacia`.`FAMILIA`(`nombre`)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
)
ENGINE = InnoDB; 


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;